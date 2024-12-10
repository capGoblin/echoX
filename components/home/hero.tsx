'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.5
          }}
        >
          <h1 className="text-7xl md:text-8xl font-bold mb-2">
            echo<span className="text-blue-500">X</span>
          </h1>
        </motion.div>
        
        <motion.h2 
          className="text-5xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-gradient">On-Chain AI Trading</span>
          <br />
          <span className="text-gradient">Perfected</span>
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          First true on-chain AI agent for cross-chain trading optimization
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Button 
            size="lg"
            className="glow-effect bg-blue-600 hover:bg-blue-500 text-lg px-8 py-6"
          >
            Start Trading with Google
          </Button>
        </motion.div>
      </div>
    </section>
  );
}