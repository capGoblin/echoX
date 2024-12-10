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

  useEffect(() => {
    const getBridge = async () => {
      // Example usage:

      const quote = await getCrossChainQuote(
        "USDT",
        56, // BSC
        "USDC",
        137, // Polygon
        "30000000000000000000" // Amount with decimals
      );

      console.log(quote);
      const swap = await executeCrossChainSwap(
        "0x2D8f3b740b12c788A5200c728eC3e640df3FeCfd",
        quote.data.routes[0] // Use first route or select based on criteria
      );

      console.log(swap);

      const status = await getCrossChainStatus(
        56, // BSC chainId
        "0xa4208f52f834771a5f96e87f6cadcd4691274289bd99e1a508e38cbc986e56e3" // transaction hash
      );

      if (status.data.status === CrossChainStatusTypes.SUCCESS) {
        console.log("Transaction completed successfully!");
        console.log("Destination hash:", status.data.destHash);
        console.log("Output amount:", status.data.outAmount);
      }
    };

    // getBridge();
  }, []);

  useEffect(() => {
    const getswap = async () => {
      const quote = await getSwapQuote(
        "bsc",
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // BNB
        "0x55d398326f99059ff775485246999027b3197955", // USDT
        "5",
        "3",
        { slippage: "1" }
      );
      console.log(quote);

      const swapTx = await getSwapTransaction({
        chain: "bsc",
        inTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        outTokenAddress: "0x55d398326f99059ff775485246999027b3197955",
        amount: "5",
        gasPrice: "3",
        slippage: "1",
        account: "0x929B44e589AC4dD99c0282614e9a844Ea9483aaa",
      });
      console.log(swapTx);
    };

    getswap();
  }, []);

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-[#0A0F1A] to-black" />

      {/* Ambient Light Effects */}
      <div className="fixed inset-0">
        <div
          className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] 
      bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
      from-blue-900/[0.03] via-transparent to-transparent 
      blur-3xl"
        />
        <div
          className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[50%] 
      bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
      from-indigo-900/[0.02] via-transparent to-transparent 
      blur-3xl"
        />
      </div>

      {/* Noise Texture */}
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.015]" />

      {/* Main Content Container */}
      <div className="relative flex flex-col h-full">
        {/* Main Content Area */}
        <div className="relative flex flex-1 h-[calc(100vh-4rem)]">
          {/* Chat Area Container */}
          <div className="relative flex-1 h-full">
            {/* Messages Area */}
            <ScrollArea className="h-[calc(100vh-10rem)]">
              {" "}
              {/* Adjusted height for header + input */}
              <div className="max-w-3xl mx-auto p-6">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{
                        opacity: 0,
                        y: 20,
                        x: message.sender === "user" ? 20 : -20,
                        scale: 0.95,
                      }}
                      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        type: "spring",
                        bounce: 0.3,
                      }}
                      layout="position"
                      className={cn(
                        "mb-6 flex",
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={cn(
                          "rounded-2xl px-6 py-3 max-w-[80%] shadow-lg relative group",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-500/40 to-blue-600/40 border border-blue-400/10"
                            : "bg-white/[0.03] border border-white/[0.02]",
                          "backdrop-blur-md"
                        )}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/[0.05] to-blue-500/0 rounded-2xl"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        {message.sender === "ai" ? (
                          <ReactMarkdown
                            className="text-sm font-mono leading-relaxed relative z-10"
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => {
                                if (
                                  children &&
                                  children.toString().trim() === '"'
                                )
                                  return null;
                                return (
                                  <p className="text-zinc-300">{children}</p>
                                );
                              },
                              code: ({ children }) => (
                                <code className="bg-black/20 rounded px-1 py-0.5 text-blue-200">
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        ) : (
                          <p className="text-sm font-mono text-white/90 relative z-10">
                            {message.text}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Fixed Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/[0.01] backdrop-blur-sm border-t border-white/[0.02]">
              <div className="max-w-3xl mx-auto p-4">
                <div className="flex items-center gap-2 bg-white/[0.02] rounded-2xl p-2 backdrop-blur-sm border border-white/[0.02]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <PaperclipIcon className="h-5 w-5 text-zinc-400" />
                  </Button>
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Send a message..."
                    className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-zinc-500"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <Mic className="h-5 w-5 text-zinc-400" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isPending}
                    className={cn(
                      "bg-blue-500/40 hover:bg-blue-500/50",
                      "rounded-xl px-4 py-2 font-medium transition-all duration-200",
                      "border border-blue-400/10",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
