'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SwapCard } from '@/components/swap/swap-card';

interface SwapViewProps {
  onChatClick: () => void;
}

export function SwapView({ onChatClick }: SwapViewProps) {
  return (
    <div className="relative">
      <SwapCard />
      <Button
        onClick={onChatClick}
        className="absolute top-4 right-4 rounded-full w-10 h-10 p-0 bg-blue-600/20 hover:bg-blue-600/30 backdrop-blur-sm"
        variant="ghost"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </div>
  );
}