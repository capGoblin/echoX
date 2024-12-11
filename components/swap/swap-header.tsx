'use client';

import { Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SwapHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold">Cross-Chain Swap</h2>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="hover:bg-white/[0.1]">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/[0.1]">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}