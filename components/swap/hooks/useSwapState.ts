"use client";

import { useState, useEffect } from "react";
import { Chain, Token } from "../types/tokens";
import { getSwapQuote } from "@/lib/swap/openocean";
import { getCrossChainQuote } from "@/lib/bridge/openocean";

// Chain ID mapping for OpenOcean
const CHAIN_ID_MAP: Record<string, number> = {
  bsc: 56,
  base: 8453,
  polygon: 137,
};

export interface SwapState {
  sellChain: Chain | null;
  sellToken: Token | null;
  buyChain: Chain | null;
  buyToken: Token | null;
  sellAmount: string;
  buyAmount: string;
}

export function useSwapState(initialState: SwapState) {
  const [state, setState] = useState<SwapState>(initialState);

  useEffect(() => {
    const fetchQuote = async () => {
      if (
        state.sellChain &&
        state.buyChain &&
        state.sellToken &&
        state.buyToken &&
        state.sellAmount &&
        parseFloat(state.sellAmount) > 0
      ) {
        try {
          // Same chain - use swap quote
          if (state.sellChain.id === state.buyChain.id) {
            const quote = await getSwapQuote(
              state.sellChain.id,
              state.sellToken.address!,
              state.buyToken.address!,
              state.sellAmount,
              "5"
            );
            setState((prev) => ({
              ...prev,
              buyAmount: (
                Number(quote.data.outAmount) /
                10 ** quote.data.outToken.decimals
              ).toString(),
            }));
          }
          // Different chains - use cross chain quote
          else {
            // Format sell amount with proper decimals from the token definition
            const formattedSellAmount = (
              parseFloat(state.sellAmount) *
              10 ** state.sellToken.decimals
            ).toString();

            console.log('Requesting cross-chain quote with:', {
              fromSymbol: state.sellToken.symbol,
              fromChainId: CHAIN_ID_MAP[state.sellChain.id],
              toSymbol: state.buyToken.symbol,
              toChainId: CHAIN_ID_MAP[state.buyChain.id],
              amount: formattedSellAmount,
            });

            const quote = await getCrossChainQuote(
              state.sellToken.symbol,
              CHAIN_ID_MAP[state.sellChain.id],
              state.buyToken.symbol,
              CHAIN_ID_MAP[state.buyChain.id],
              formattedSellAmount
            );
            
            // Get the output amount and format it according to destination token decimals
            const outputAmount = quote.bridgeRoute.outputAmount;
            const decimals = quote.bridgeRoute.toAsset.decimals;
            const formattedAmount = (
              Number(outputAmount) /
              10 ** decimals
            ).toString();

            setState((prev) => ({
              ...prev,
              buyAmount: formattedAmount,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch quote:", error);
          setState((prev) => ({
            ...prev,
            buyAmount: "0.0",
          }));
        }
      }
    };

    fetchQuote();
  }, [
    state.sellChain,
    state.buyChain,
    state.sellToken,
    state.buyToken,
    state.sellAmount,
  ]);

  const swapTokens = () => {
    setState((prev) => ({
      ...prev,
      sellChain: prev.buyChain,
      sellToken: prev.buyToken,
      buyChain: prev.sellChain,
      buyToken: prev.sellToken,
      sellAmount: prev.buyAmount,
      buyAmount: prev.sellAmount,
    }));
  };

  const updateState = (updates: Partial<SwapState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return {
    state,
    swapTokens,
    updateState,
  };
}
