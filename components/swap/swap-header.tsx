"use client";

import { Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SwapHeader() {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button variant="ghost" size="icon" className="hover:bg-white/[0.1]">
        <RefreshCw className="h-4 w-4" />
      </Button>
      <h2 className="text-lg font-semibold flex-1">Cross-Chain Swap</h2>
    </div>
  );
}
