'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Token, TOKENS } from './types/tokens';

interface TokenSelectorProps {
  defaultToken: Token | null;
  chainId: 'bsc' | 'base' | 'polygon' | null;
  onSelect?: (token: Token) => void;
}

export function TokenSelector({ defaultToken, chainId, onSelect }: TokenSelectorProps) {
  const availableTokens = chainId ? TOKENS[chainId] : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-1 hover:bg-white/[0.1] rounded-lg"
        >
          <div className="flex items-center gap-2">
            {defaultToken && (
              <>
                <div className="w-7 h-7 relative">
                  <Image
                    src={defaultToken.logoURI}
                    alt={defaultToken.name}
                    fill
                    className="rounded-full"
                  />
                </div>
                <span className="font-medium">{defaultToken.symbol}</span>
                <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
              </>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[160px]">
        {availableTokens.map((token) => (
          <DropdownMenuItem
            key={token.symbol}
            onClick={() => onSelect?.(token)}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 relative">
              <Image
                src={token.logoURI}
                alt={token.name}
                fill
                className="rounded-full"
              />
            </div>
            <span>{token.symbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}