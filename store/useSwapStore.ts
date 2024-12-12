import { create } from "zustand";
import { Chain, Token, CHAINS, TOKENS } from "@/components/swap/types/tokens";

export interface SwapState {
  sellChain: Chain | null;
  sellToken: Token | null;
  buyChain: Chain | null;
  buyToken: Token | null;
  sellAmount: string;
  buyAmount: string;
  isLoading: boolean;
  toast: {
    message: string;
    type: "success" | "error" | "info";
    show: boolean;
  } | null;
}

interface SwapStore extends SwapState {
  swapTokens: () => void;
  updateState: (updates: Partial<SwapState>) => void;
  setLoading: (loading: boolean) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  hideToast: () => void;
}

export const useSwapStore = create<SwapStore>((set) => ({
  // Initial state
  sellChain: CHAINS[0],
  sellToken: TOKENS.bsc[0],
  buyChain: CHAINS[1],
  buyToken: TOKENS.base[0],
  sellAmount: "0.0",
  buyAmount: "0.0",
  isLoading: false,
  toast: null,

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
  
  setLoading: (loading) => set({ isLoading: loading }),

  showToast: (message, type) => {
    set({ toast: { message, type, show: true } });
    setTimeout(() => {
      set({ toast: null });
    }, 3000);
  },

  hideToast: () => set({ toast: null }),
})); 