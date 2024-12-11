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
import { Chain, CHAINS } from './types/tokens';

interface ChainSelectorProps {
  defaultChain: Chain | null;
  onSelect?: (chain: Chain) => void;
}

export function ChainSelector({ defaultChain, onSelect }: ChainSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-white/[0.1] rounded-lg"
        >
          <div className="flex items-center gap-1.5">
            {defaultChain && (
              <div className="w-5 h-5 relative">
                <Image
                  src={defaultChain.logoURI}
                  alt={defaultChain.name}
                  fill
                  className="rounded-full"
                />
              </div>
            )}
            <span className="text-sm">{defaultChain?.name || 'Select Chain'}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[160px]">
        {CHAINS.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => onSelect?.(chain)}
            className="flex items-center gap-2"
          >
            <div className="w-5 h-5 relative">
              <Image
                src={chain.logoURI}
                alt={chain.name}
                fill
                className="rounded-full"
              />
            </div>
            <span>{chain.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}