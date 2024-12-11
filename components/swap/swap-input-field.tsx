'use client';

import { ChainSelector } from './chain-selector';
import { TokenSelector } from './token-selector';
import { NumberInput } from './number-input';
import { Chain, Token, TOKENS } from './types/tokens';

interface SwapInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  selectedChain: Chain | null;
  selectedToken: Token | null;
  onChainSelect: (chain: Chain) => void;
  onTokenSelect: (token: Token) => void;
}

export function SwapInputField({
  label,
  value,
  onChange,
  selectedChain,
  selectedToken,
  onChainSelect,
  onTokenSelect,
}: SwapInputFieldProps) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.1] p-3 hover:bg-white/[0.04] transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <ChainSelector
            defaultChain={selectedChain}
            onSelect={onChainSelect}
          />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">Balance: 0.0</span>
      </div>
      
      <div className="flex items-center gap-2">
        <TokenSelector
          defaultToken={selectedToken}
          chainId={selectedChain?.id as keyof typeof TOKENS | null}
          onSelect={onTokenSelect}
        />
        <div className="flex-1 relative group">
          <NumberInput
            value={value}
            onChange={onChange}
            placeholder="0.0"
          />
          <div className="absolute inset-0 pointer-events-none rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity">
            <div className="absolute inset-0 rounded-lg ring-1 ring-blue-500/20" />
            <div className="absolute inset-0 rounded-lg bg-blue-500/5" />
          </div>
        </div>
      </div>
    </div>
  );
}