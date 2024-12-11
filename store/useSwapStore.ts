import { create } from "zustand";
import { Chain, Token, CHAINS, TOKENS } from "@/components/swap/types/tokens";

export interface SwapState {
  sellChain: Chain | null;
  sellToken: Token | null;
  buyChain: Chain | null;
  buyToken: Token | null;
  sellAmount: string;
  buyAmount: string;
}

interface SwapStore extends SwapState {
  swapTokens: () => void;
  updateState: (updates: Partial<SwapState>) => void;
}

export const useSwapStore = create<SwapStore>((set) => ({
  // Initial state
  sellChain: CHAINS[0],
  sellToken: TOKENS.bsc[0],
  buyChain: CHAINS[1],
  buyToken: TOKENS.base[0],
  sellAmount: "0.0",
  buyAmount: "0.0",

  // Actions
  swapTokens: () =>
    set((state) => ({
      sellChain: state.buyChain,
      sellToken: state.buyToken,
      buyChain: state.sellChain,
      buyToken: state.sellToken,
      sellAmount: state.buyAmount,
      buyAmount: state.sellAmount,
    })),

  updateState: (updates) => set((state) => ({ ...state, ...updates })),
})); 