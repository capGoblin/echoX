'use client';

import { motion } from 'framer-motion';
import { FloatingObjects } from './floating-objects';
import { GlowSpheres } from './effects/glow-spheres';
import { GridPattern } from './effects/grid-pattern';
import { TokenBubbles } from './effects/token-bubbles';

export function AgentBackground() {
  return (
    <>
      {/* Base dark background */}
      <div className="fixed inset-0 bg-[#0D0F12]" />
      
      {/* Grid pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <GridPattern />
      </motion.div>

      {/* Token bubbles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <TokenBubbles />
      </motion.div>

      {/* Glow spheres */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <GlowSpheres />
      </motion.div>
      
      {/* Floating objects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <FloatingObjects />
      </motion.div>
      
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0F12]/90" />
      
      {/* Noise texture */}
      <div 
        className="fixed inset-0 opacity-[0.15] mix-blend-soft-light"
        style={{ 
          backgroundImage: 'url("/noise.png")',
          backgroundRepeat: 'repeat',
        }} 
      />
      
      {/* Center spotlight */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2), transparent 70%)',
        }}
      />
    </>
  );
}