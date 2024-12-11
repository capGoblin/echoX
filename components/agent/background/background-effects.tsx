'use client';

import { motion } from 'framer-motion';
import { GlowSpheres } from '../effects/glow-spheres';
import { GridPattern } from '../effects/grid-pattern';
import { TokenBubbles } from '../effects/token-bubbles';

export function BackgroundEffects() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <GridPattern />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="backdrop-blur-lg"
      >
        <TokenBubbles />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="backdrop-blur-md"
      >
        <GlowSpheres />
      </motion.div>
    </>
  );
}