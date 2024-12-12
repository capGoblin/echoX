"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperclipIcon, Mic, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import {
  CrossChainStatusTypes,
  executeCrossChainSwap,
  getCrossChainQuote,
  getCrossChainStatus,
} from "@/lib/bridge/openocean";
import { getSwapQuote, getSwapTransaction } from "@/lib/swap/openocean";
import { AgentBackground } from "@/components/agent/background";
import { CardContainer } from "@/components/agent/card-container";
import { Nav } from "@/components/agent/nav";

const Page = () => {
  const [messages, setMessages] = React.useState<
    Array<{
      id: string;
      text: string;
      sender: "user" | "ai";
    }>
  >([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "ai",
    },
  ]);

  const [inputMessage, setInputMessage] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSendMessage = () => {
    setMessages([...messages, { id: "2", text: inputMessage, sender: "user" }]);
    setInputMessage("");
  };

  // useEffect(() => {
  //   const getBridge = async () => {
  //     // Example usage:

  //     const quote = await getCrossChainQuote(
  //       "USDT",
  //       56, // BSC
  //       "USDC",
  //       137, // Polygon
  //       "30000000000000000000" // Amount with decimals
  //     );

  //     console.log(quote);
  //     const swap = await executeCrossChainSwap(
  //       "0x2D8f3b740b12c788A5200c728eC3e640df3FeCfd",
  //       quote.data.routes[0] // Use first route or select based on criteria
  //     );

  //     console.log(swap);

  //     const status = await getCrossChainStatus(
  //       56, // BSC chainId
  //       "0xa4208f52f834771a5f96e87f6cadcd4691274289bd99e1a508e38cbc986e56e3" // transaction hash
  //     );

  //     if (status.data.status === CrossChainStatusTypes.SUCCESS) {
  //       console.log("Transaction completed successfully!");
  //       console.log("Destination hash:", status.data.destHash);
  //       console.log("Output amount:", status.data.outAmount);
  //     }
  //   };

  //   // getBridge();
  // }, []);

  // useEffect(() => {
  //   const getswap = async () => {
  //     const quote = await getSwapQuote(
  //       "bsc",
  //       "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // BNB
  //       "0x55d398326f99059ff775485246999027b3197955", // USDT
  //       "5",
  //       "3",
  //       { slippage: "1" }
  //     );
  //     console.log(quote);

  //     const swapTx = await getSwapTransaction({
  //       chain: "bsc",
  //       inTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  //       outTokenAddress: "0x55d398326f99059ff775485246999027b3197955",
  //       amount: "5",
  //       gasPrice: "3",
  //       slippage: "1",
  //       account: "0x929B44e589AC4dD99c0282614e9a844Ea9483aaa",
  //     });
  //     console.log(swapTx);
  //   };

  //   getswap();
  // }, []);

  return (
    <>
      <Nav />
      <main className="relative min-h-screen flex items-center justify-center p-4 pt-20 backdrop-blur-3xl">
        {/* <AgentBackground /> */}
        <div className="relative z-10 w-full max-w-md">
          <CardContainer />
        </div>
      </main>
    </>
  );
};

export default Page;
