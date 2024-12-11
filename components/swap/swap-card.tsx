'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { SwapHeader } from './swap-header';
import { SwapInputField } from './swap-input-field';
import { SwapButtonArrow } from './swap-button-arrow';
import { SwapButton } from './swap-button';
import { CHAINS, TOKENS } from './types/tokens';
import { useSwapState } from './hooks/useSwapState';

export function SwapCard() {
  const { state, swapTokens, updateState } = useSwapState({
    sellChain: CHAINS[0],
    sellToken: TOKENS.bsc[0],
    buyChain: CHAINS[1],
    buyToken: TOKENS.base[0],
    sellAmount: '0.0',
    buyAmount: '0.0',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden backdrop-blur-2xl bg-black/20 border-white/[0.08] shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
        <div className="relative p-4">
          <SwapHeader />

          <div className="space-y-2">
            <SwapInputField
              label="You pay"
              value={state.sellAmount}
              onChange={(value) => updateState({ sellAmount: value })}
              selectedChain={state.sellChain}
              selectedToken={state.sellToken}
              onChainSelect={(chain) => updateState({ sellChain: chain })}
              onTokenSelect={(token) => updateState({ sellToken: token })}
            />

            <SwapButtonArrow onClick={swapTokens} />

            <SwapInputField
              label="You receive"
              value={state.buyAmount}
              onChange={(value) => updateState({ buyAmount: value })}
              selectedChain={state.buyChain}
              selectedToken={state.buyToken}
              onChainSelect={(chain) => updateState({ buyChain: chain })}
              onTokenSelect={(token) => updateState({ buyToken: token })}
            />
          </div>

          <SwapButton />

          <p className="text-sm text-muted-foreground text-center mt-4">
            Trade tokens instantly across multiple chains
          </p>
        </div>
      </Card>
    </motion.div>
  );
}