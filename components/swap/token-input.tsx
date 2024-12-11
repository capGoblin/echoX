'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Token {
  symbol: string;
  icon: string;
  name: string;
}

interface TokenInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultToken: Token | null;
}

export function TokenInput({ label, value, onChange, defaultToken }: TokenInputProps) {
  return (
    <div className="rounded-xl bg-card/50 p-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">Balance: 0.0</span>
      </div>
      
      <div className="flex gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-0 bg-transparent text-2xl focus-visible:ring-0"
          placeholder="0.0"
        />
        
        <Button
          variant="ghost"
          className="hover:bg-accent rounded-xl h-auto py-2"
        >
          {defaultToken ? (
            <div className="flex items-center gap-2">
              <span>{defaultToken.icon}</span>
              <span>{defaultToken.symbol}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Select token</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground mt-1">
        $0.00
      </div>
    </div>
  );
}