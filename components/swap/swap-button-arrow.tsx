'use client';

import { ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SwapButtonArrowProps {
  onClick: () => void;
}

export function SwapButtonArrow({ onClick }: SwapButtonArrowProps) {
  return (
    <div className="relative h-8">
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            onClick={onClick}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/40 border border-white/[0.08] hover:bg-black/60 backdrop-blur-sm"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}