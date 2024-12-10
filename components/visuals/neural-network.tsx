'use client';

import { motion } from 'framer-motion';

export function NeuralNetwork() {
  return (
    <motion.div 
      className="absolute inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}