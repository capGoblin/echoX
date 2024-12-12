"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useLogin } from "@/hooks/useLogin";
import { SwapLoader } from "@/components/ui/loader";
import {
  executeCrossChainSwap,
  getCrossChainQuote,
} from "@/lib/bridge/openocean";
import { getSwapQuote, getSwapTransaction } from "@/lib/swap/openocean";
import { useSwapStore } from "@/store/useSwapStore";

// Chain ID mapping for OpenOcean
export const CHAIN_ID_MAP: Record<string, number> = {
  bsc: 56,
  base: 8453,
  polygon: 137,
};

export function SwapButton() {
  const { provider, signer } = useStore();
  const { handleLogin } = useLogin();
  const state = useSwapStore();

  const handleClick = async () => {
    try {
      console.log("Swap button clicked");
      const setLoading = useSwapStore.getState().setLoading;
      const showToast = useSwapStore.getState().showToast;
      setLoading(true);

      // If no provider, connect wallet first
      if (!provider || !signer) {
        await handleLogin();
        setLoading(false);
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
        console.error("Invalid swap state:", state);
        setLoading(false);
        showToast("Please fill in all swap details", "error");
        return;
      }

      // Switch to the correct chain before proceeding
      await provider.switchChain({ id: CHAIN_ID_MAP[state.sellChain.id] });

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
        const tx = await provider.sendTransaction({
          chain: null,
          account: signer[0],
          to: response.data.to as `0x${string}`,
          data: response.data.data as `0x${string}`,
          value: BigInt(response.data.value),
        });

        console.log("Cross-chain swap executed:", tx);
        showToast("Cross-chain swap successful!", "success");
      }
      // Same chain - execute regular swap
      else {
        // Get swap quote first
        await getSwapQuote(
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
        const tx = await provider.sendTransaction({
          chain: null,
          account: signer[0],
          to: swapTx.data.to as `0x${string}`,
          data: swapTx.data.data as `0x${string}`,
          value: BigInt(swapTx.data.value),
          gas: BigInt(swapTx.data.estimatedGas),
        });

        console.log("Same-chain swap executed:", tx);
        showToast("Swap successful!", "success");
      }

      setLoading(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      useSwapStore.getState().setLoading(false);
      useSwapStore
        .getState()
        .showToast("Transaction failed: " + (error as Error).message, "error");
    }
  };

  const isLoading = useSwapStore((state) => state.isLoading);

  return (
    <Button
      className="w-full mt-4 bg-blue-600 hover:bg-blue-500 swap-button"
      onClick={handleClick}
      disabled={isLoading}
    >
      {!provider ? (
        "Connect Wallet"
      ) : isLoading ? (
        <div className="flex items-center gap-2">
          <SwapLoader className="scale-50" />
          <span>Swapping</span>
        </div>
      ) : (
        "Swap"
      )}
    </Button>
  );
}
