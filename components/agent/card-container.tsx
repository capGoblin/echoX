"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwapCard } from "@/components/swap/swap-card";
import { AIChat } from "@/components/agent/chat/ai-chat";
import { CustomToast } from "../ui/toast";
import { useSwapStore } from "@/store/useSwapStore";

export function CardContainer() {
  const [isFlipped, setIsFlipped] = useState(false);
  const toast = useSwapStore((state) => state.toast);
  
  return (
    <div className="relative w-full max-w-md">
      {!isFlipped ? (
        <div className="w-full">
          <SwapCard />
          <Button
            onClick={() => setIsFlipped(true)}
            className="absolute top-4 right-4 rounded-full w-10 h-10 p-0 bg-blue-600/20 hover:bg-blue-600/30 backdrop-blur-sm"
            variant="ghost"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="w-full">
          <AIChat onClose={() => setIsFlipped(false)} />
        </div>
      )}
      {toast && <CustomToast {...toast} />}
    </div>
  );
}
