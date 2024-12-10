'use client';

import { motion } from 'framer-motion';
import { Terminal, Brain, Network, Zap } from 'lucide-react';

const steps = [
  {
    icon: Terminal,
    title: 'User Initiation',
    description: 'Express your trade in plain language',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'On-chain AI analyzes optimal routes',
  },
  {
    icon: Network,
    title: 'Cross-Chain Orchestration',
    description: 'Agent coordinates across multiple chains',
  },
  {
    icon: Zap,
    title: 'Smart Execution',
    description: 'Optimal execution across aggregators',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gradient">How it works</span>
        </motion.h2>

        <div className="relative">
          {/* Base Connection Line */}
          <div className="absolute top-1/2 left-[12.5%] right-[12.5%] h-[2px] bg-blue-500/30" />
          
          {/* Animated Flow Light */}
          <div className="absolute top-1/2 left-[12.5%] w-[25%] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent flow-light" />

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="glass-panel rounded-2xl p-6 text-center h-full">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
                    <div className="relative bg-blue-500/10 rounded-full p-4 inline-block">
                      <step.icon className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}