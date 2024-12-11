"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useLogin } from "@/hooks/useLogin";
import {
  executeCrossChainSwap,
  getCrossChainQuote,
} from "@/lib/bridge/openocean";
import { getSwapQuote, getSwapTransaction } from "@/lib/swap/openocean";
import { useSwapState } from "./hooks/useSwapState";

// Chain ID mapping for OpenOcean
const CHAIN_ID_MAP: Record<string, number> = {
  bsc: 56,
  base: 8453,
  polygon: 137,
};

export function SwapButton() {
  const { provider, signer } = useStore();
  const { handleLogin } = useLogin();
  const { state } = useSwapState({
    sellChain: null,
    sellToken: null,
    buyChain: null,
    buyToken: null,
    sellAmount: "0.0",
    buyAmount: "0.0",
  });

  const handleClick = async () => {
    try {
      // If no provider, connect wallet first
      if (!provider || !signer) {
        await handleLogin();
        return;
      }

      // Ensure we have all required state
      if (
        !state.sellChain ||
        !state.buyChain ||
        !state.sellToken ||
        !state.buyToken ||
        !state.sellAmount ||
        parseFloat(state.sellAmount) <= 0
      ) {
        console.error("Invalid swap state");
        return;
      }

      // Format sell amount with proper decimals
      const formattedSellAmount = (
        parseFloat(state.sellAmount) *
        10 ** state.sellToken.decimals
      ).toString();

      // Different chains - execute cross-chain swap
      if (state.sellChain.id !== state.buyChain.id) {
        // Get quote first
        const quote = await getCrossChainQuote(
          state.sellToken.symbol,
          CHAIN_ID_MAP[state.sellChain.id],
          state.buyToken.symbol,
          CHAIN_ID_MAP[state.buyChain.id],
          formattedSellAmount
        );

        // Execute cross-chain swap
        const response = await executeCrossChainSwap(signer[0], quote);
        console.log("Cross-chain swap executed:", response);
      }
      // Same chain - execute regular swap
      else {
        // Get swap quote first
        const quote = await getSwapQuote(
          state.sellChain.id,
          state.sellToken.address!,
          state.buyToken.address!,
          formattedSellAmount,
          "5", // Default gas price
          { slippage: "1" } // 1% slippage
        );

        // Get swap transaction data
        const swapTx = await getSwapTransaction({
          chain: state.sellChain.id,
          inTokenAddress: state.sellToken.address!,
          outTokenAddress: state.buyToken.address!,
          amount: formattedSellAmount,
          gasPrice: "5",
          slippage: "1",
          account: signer[0],
        });

        // Execute the transaction
        // const tx = await provider.sendTransaction({
        //   from: signer[0],
        //   to: swapTx.data.to,
        //   data: swapTx.data.data,
        //   value: swapTx.data.value,
        //   gas: swapTx.data.estimatedGas
        // });

        console.log("Same-chain swap executed:", swapTx);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <Button
      className="w-full mt-4 bg-blue-600 hover:bg-blue-500"
      onClick={handleClick}
    >
      {!provider ? "Connect Wallet" : "Swap"}
    </Button>
  );
}
