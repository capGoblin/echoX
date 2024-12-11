"use client";

import { useState } from "react";
import { ChainSelector } from "./chain-selector";
import { TokenSelector } from "./token-selector";
import { Input } from "@/components/ui/input";
import { Chain, Token, TOKENS } from "./types/tokens";

interface SwapInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultChain: Chain | null;
  defaultToken: Token | null;
}

export function SwapInput({
  label,
  value,
  onChange,
  defaultChain,
  defaultToken,
}: SwapInputProps) {
  const [selectedChain, setSelectedChain] = useState(defaultChain);
  const [selectedToken, setSelectedToken] = useState(defaultToken);

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.1] p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <ChainSelector
            defaultChain={selectedChain}
            onSelect={setSelectedChain}
          />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">Balance: 0.0</span>
      </div>

      <div className="flex items-center gap-2">
        <TokenSelector
          defaultToken={selectedToken}
          chainId={selectedChain?.id as keyof typeof TOKENS | null}
          onSelect={setSelectedToken}
        />
        <div className="flex-1">
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-right text-xl bg-transparent border-0 h-auto p-0 focus-visible:ring-0"
            placeholder="0.0"
          />
          {/* {selectedToken?.price && (
            <div className="text-right text-sm text-muted-foreground">
              ${(Number(value || 0) * selectedToken.price).toLocaleString()}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
