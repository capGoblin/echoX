"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SwapHeader } from "./swap-header";
import { SwapInputField } from "./swap-input-field";
import { SwapButtonArrow } from "./swap-button-arrow";
import { SwapButton } from "./swap-button";
import { useSwapStore } from "@/store/useSwapStore";
import { useMemo, useEffect } from "react";
import { getSwapQuote } from "@/lib/swap/openocean";
import { getCrossChainQuote } from "@/lib/bridge/openocean";
import { SwapLoader } from "@/components/ui/loader";
import { CustomToast } from "@/components/ui/toast";

// Chain ID mapping for OpenOcean
const CHAIN_ID_MAP: Record<string, number> = {
  bsc: 56,
  base: 8453,
  polygon: 137,
};

export function SwapCard() {
  // Use individual selectors instead of a combined one
  const sellChain = useSwapStore((state) => state.sellChain);
  const sellToken = useSwapStore((state) => state.sellToken);
  const buyChain = useSwapStore((state) => state.buyChain);
  const buyToken = useSwapStore((state) => state.buyToken);
  const sellAmount = useSwapStore((state) => state.sellAmount);
  const buyAmount = useSwapStore((state) => state.buyAmount);
  const isLoading = useSwapStore((state) => state.isLoading);
  const toast = useSwapStore((state) => state.toast);

  // Memoize the actions
  const actions = useMemo(
    () => ({
      swapTokens: useSwapStore.getState().swapTokens,
      updateState: useSwapStore.getState().updateState,
    }),
    []
  );

  // Quote fetching effect
  useEffect(() => {
    const fetchQuote = async () => {
      if (
        sellChain &&
        buyChain &&
        sellToken &&
        buyToken &&
        sellAmount &&
        parseFloat(sellAmount) > 0
      ) {
        try {
          // Same chain - use swap quote
          if (sellChain.id === buyChain.id) {
            const quote = await getSwapQuote(
              sellChain.id,
              sellToken.address!,
              buyToken.address!,
              sellAmount,
              "5"
            );
            actions.updateState({
              buyAmount: (
                Number(quote.data.outAmount) /
                10 ** quote.data.outToken.decimals
              ).toString(),
            });
          }
          // Different chains - use cross chain quote
          else {
            // Format sell amount with proper decimals from the token definition
            const formattedSellAmount = (
              parseFloat(sellAmount) *
              10 ** sellToken.decimals
            ).toString();

            const quote = await getCrossChainQuote(
              sellToken.symbol,
              CHAIN_ID_MAP[sellChain.id],
              buyToken.symbol,
              CHAIN_ID_MAP[buyChain.id],
              formattedSellAmount
            );

            // Get the output amount and format it according to destination token decimals
            const outputAmount = quote.bridgeRoute.outputAmount;
            const decimals = quote.bridgeRoute.toAsset.decimals;
            const formattedAmount = (
              Number(outputAmount) /
              10 ** decimals
            ).toString();

            actions.updateState({
              buyAmount: formattedAmount,
            });
          }
        } catch (error) {
          console.error("Failed to fetch quote:", error);
          actions.updateState({
            buyAmount: "0.0",
          });
        }
      }
    };

    fetchQuote();
  }, [sellChain, buyChain, sellToken, buyToken, sellAmount, actions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden backdrop-blur-2xl bg-black/20 border-white/[0.08] shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
        <div className="relative p-4">
          <SwapHeader />

          <div className="space-y-2">
            <SwapInputField
              label="You pay"
              value={sellAmount}
              onChange={(value) => actions.updateState({ sellAmount: value })}
              selectedChain={sellChain}
              selectedToken={sellToken}
              onChainSelect={(chain) =>
                actions.updateState({ sellChain: chain })
              }
              onTokenSelect={(token) =>
                actions.updateState({ sellToken: token })
              }
            />

            <SwapButtonArrow onClick={actions.swapTokens} />

            <SwapInputField
              label="You receive"
              value={buyAmount}
              onChange={(value) => actions.updateState({ buyAmount: value })}
              selectedChain={buyChain}
              selectedToken={buyToken}
              onChainSelect={(chain) =>
                actions.updateState({ buyChain: chain })
              }
              onTokenSelect={(token) =>
                actions.updateState({ buyToken: token })
              }
            />
          </div>

          <SwapButton />

          <p className="text-sm text-muted-foreground text-center mt-4">
            Trade tokens instantly across multiple chains
          </p>
        </div>
      </Card>
      {toast && <CustomToast {...toast} />}
    </motion.div>
  );
}
