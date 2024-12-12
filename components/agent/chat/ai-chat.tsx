"use client";
import { createZGServingNetworkBroker } from "@0glabs/0g-serving-broker";
import { use, useEffect, useState } from "react";
import { AIChatProps } from "./types";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { getEthersSigner } from "@/lib/utils";
import {
  createWalletClient,
  custom,
  defineChain,
  WalletClient,
  Address,
} from "viem";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { ethers } from "ethers";
import { useSwapStore } from "@/store/useSwapStore";
import { CHAINS, Token, TOKENS } from "@/components/swap/types/tokens";
import { useStore } from "@/store/useStore";
import { useLogin } from "@/hooks/useLogin";
import {
  executeCrossChainSwap,
  getCrossChainQuote,
} from "@/lib/bridge/openocean";
import { getSwapQuote, getSwapTransaction } from "@/lib/swap/openocean";
import { CHAIN_ID_MAP } from "@/components/swap/swap-button";
import { Chain } from "@/components/swap/types/tokens";
import { CustomToast } from "@/components/ui/toast";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const useSwapHandler = () => {
  const { provider, signer } = useStore();
  const { handleLogin } = useLogin();
  const { setLoading, showToast } = useSwapStore();

  const executeSwap = async (swapDetails: {
    sellChain: Chain;
    buyChain: Chain;
    sellToken: Token;
    buyToken: Token;
    sellAmount: string;
  }) => {
    console.log("Executing swap:", swapDetails);
    try {
      setLoading(true);

      // If no provider, connect wallet first
      if (!provider || !signer) {
        await handleLogin();
        setLoading(false);
        return;
      }

      // Update swap store
      useSwapStore.getState().updateState({
        sellChain: swapDetails.sellChain,
        buyChain: swapDetails.buyChain,
        sellToken: swapDetails.sellToken,
        buyToken: swapDetails.buyToken,
        sellAmount: swapDetails.sellAmount,
      });

      // Switch to the correct chain
      await provider.switchChain({
        id: CHAIN_ID_MAP[swapDetails.sellChain.id],
      });

      // Format sell amount
      const formattedSellAmount = (
        parseFloat(swapDetails.sellAmount) *
        10 ** swapDetails.sellToken.decimals
      ).toString();

      // Different chains - execute cross-chain swap
      if (swapDetails.sellChain.id !== swapDetails.buyChain.id) {
        const quote = await getCrossChainQuote(
          swapDetails.sellToken.symbol,
          CHAIN_ID_MAP[swapDetails.sellChain.id],
          swapDetails.buyToken.symbol,
          CHAIN_ID_MAP[swapDetails.buyChain.id],
          formattedSellAmount
        );

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
        const quote = await getSwapQuote(
          swapDetails.sellChain.id,
          swapDetails.sellToken.address!,
          swapDetails.buyToken.address!,
          formattedSellAmount,
          "5",
          { slippage: "1" }
        );

        const swapTx = await getSwapTransaction({
          chain: swapDetails.sellChain.id,
          inTokenAddress: swapDetails.sellToken.address!,
          outTokenAddress: swapDetails.buyToken.address!,
          amount: formattedSellAmount,
          gasPrice: "5",
          slippage: "1",
          account: signer[0],
        });

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
    } catch (error) {
      console.error("Transaction failed:", error);
      showToast("Transaction failed: " + (error as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { executeSwap };
};

export function AIChat({ onClose }: AIChatProps) {
  const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID_ZG!;
  const ADMIN_PRIVATE_KEY = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY_ZG!;
  const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
  const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "Hi! I'm your AI trading assistant. I can help you swap tokens across different chains the cheapest way possible. Try something like 'I want to swap 0.1 BNB to USDC on base'.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [broker, setBroker] = useState<any>();
  const [services, setServices] = useState<any>();

  const { executeSwap } = useSwapHandler();

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async (): Promise<void> => {
    try {
      // Initialize broker with connected wallet
      const broker = await createZGServingNetworkBroker(adminWallet);
      const services = await broker.listService();
      setBroker(broker);
      setServices(services);
      console.log("Services:", services);

      // // Proceed with request after services are loaded
      // if (services && services.length > 0) {
      //   await request(broker, services[0]);
      // }
    } catch (error) {
      console.error("Error getting services:", error);
    } finally {
      setLoading(false);
    }
  };

  const request = async (broker: any, service: any, input: string) => {
    try {
      const prompt = `You are a helpful AI assistant for a crypto swap application. When users describe a swap they want to perform, extract the following information from their message:
        - sellChain (the chain they want to swap from)
        - buyChain (the chain they want to swap to)
        - sellToken (the token they want to swap from)
        - buyToken (the token they want to swap to)
        - sellAmount (the amount they want to swap)

        Only respond with a valid JSON object containing these fields. For example:
        {
          "sellChain": "base",
          "buyChain": "bsc",
          "sellToken": "ETH",
          "buyToken": "USDC",
          "sellAmount": "0.1"
        }

        The ONLY supported tokens are:
        - BNB, USDC in BSC
        - ETH, USDC in Base
        - MATIC, USDC in Polygon

        Keep your response strictly in JSON format without any additional text.

        User's message: "${input}"`;
      // const prompt = "what model are you using?";

      await broker.settleFee(service.provider, service.name, 0.00000000001);
      console.log("Settled fee");
      const { endpoint, model } = await broker.getServiceMetadata(
        service.provider,
        service.name
      );
      console.log("Got service metadata");
      const headers = await broker.getRequestHeaders(
        service.provider,
        service.name,
        prompt
      );
      console.log("Got request headers");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          model,
          prompt,
          headers,
        }),
      });
      console.log("Got response");
      const completion = await response.json();
      if (completion) {
        console.log("Full completion:", completion);
        const responseContent = completion.choices[0].message.content;
        setResponse(responseContent);
      }
    } catch (error) {
      console.error("Error in request:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };
    setInput("");
    setMessages((prev) => [...prev, newMessage]);

    try {
      // Get AI response
      await request(broker, services[0], newMessage.content);
      console.log("Response:", response);
      // Try to parse the JSON response
      try {
        const swapDetails = JSON.parse(response);
        // Add progress message
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: getSwapProgressMessage(swapDetails),
            timestamp: new Date(),
          },
        ]);
        // Validate required fields
        if (
          swapDetails.sellChain &&
          swapDetails.buyChain &&
          swapDetails.sellToken &&
          swapDetails.buyToken &&
          swapDetails.sellAmount
        ) {
          console.log("Valid swap details");
          // Find the actual Chain and Token objects
          const sellChain = CHAINS.find(
            (chain) => chain.id === swapDetails.sellChain.toLowerCase()
          );
          const buyChain = CHAINS.find(
            (chain) => chain.id === swapDetails.buyChain.toLowerCase()
          );
          console.log("Found chains:", { sellChain, buyChain });

          const sellToken = TOKENS[
            swapDetails.sellChain.toLowerCase() as keyof typeof TOKENS
          ]?.find((token) => token.symbol === swapDetails.sellToken);
          const buyToken = TOKENS[
            swapDetails.buyChain.toLowerCase() as keyof typeof TOKENS
          ]?.find((token) => token.symbol === swapDetails.buyToken);
          console.log("Found tokens:", { sellToken, buyToken });

          if (sellChain && buyChain && sellToken && buyToken) {
            console.log("All tokens and chains found, executing swap...");
            await executeSwap({
              sellChain,
              buyChain,
              sellToken,
              buyToken,
              sellAmount: swapDetails.sellAmount,
            });
          }
        }
      } catch (error) {
        console.error("Failed to parse AI response:", error);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const getSwapProgressMessage = (swapDetails: any) => {
    if (!swapDetails) return "Processing your request...";

    const { sellChain, buyChain, sellToken, buyToken, sellAmount } =
      swapDetails;

    if (sellChain === buyChain) {
      return `Swapping ${sellAmount} ${sellToken} to ${buyToken} on ${sellChain}...`;
    } else {
      return `Cross-chain swapping ${sellAmount} ${sellToken} on ${sellChain} to ${buyToken} on ${buyChain}...`;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg backdrop-blur-2xl bg-black/20 border border-white/[0.08] shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
      <div className="relative p-4">
        <ChatHeader onClose={onClose} />
        <MessageList messages={messages} />
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
