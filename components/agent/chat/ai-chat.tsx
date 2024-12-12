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
import { CHAINS, TOKENS } from "@/components/swap/types/tokens";

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

export function AIChat({ onClose }: AIChatProps) {
  const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID_ZG!;
  const ADMIN_PRIVATE_KEY = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY_ZG!;
  const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
  const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [broker, setBroker] = useState<any>();
  const [services, setServices] = useState<any>();

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
    setMessages((prev) => [...prev, newMessage]);

    try {
      // Get AI response
      await request(broker, services[0], input);
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
          // Find the actual Chain and Token objects
          const sellChain = CHAINS.find(
            (chain) => chain.id === swapDetails.sellChain.toLowerCase()
          );
          const buyChain = CHAINS.find(
            (chain) => chain.id === swapDetails.buyChain.toLowerCase()
          );
          const sellToken = TOKENS[
            swapDetails.sellChain.toLowerCase() as keyof typeof TOKENS
          ]?.find((token) => token.symbol === swapDetails.sellToken);
          const buyToken = TOKENS[
            swapDetails.buyChain.toLowerCase() as keyof typeof TOKENS
          ]?.find((token) => token.symbol === swapDetails.buyToken);

          if (sellChain && buyChain && sellToken && buyToken) {
            // Update swap store
            useSwapStore.getState().updateState({
              sellChain,
              buyChain,
              sellToken,
              buyToken,
              sellAmount: swapDetails.sellAmount,
            });

            // Get the swap button component's handleClick function
            const swapButtonElement = document.querySelector(
              "button.swap-button"
            ) as HTMLButtonElement;
            if (swapButtonElement) {
              swapButtonElement.click();
            }
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
