'use client';

import { motion } from 'framer-motion';
import { Brain, Link, KeyRound } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'On-Chain AI Agent',
    highlight: '100% on-chain execution',
    description: 'No centralized AI vulnerabilities',
    delay: 0,
  },
  {
    icon: Link,
    title: 'Cross-Chain Optimization',
    highlight: 'Best routes across all chains',
    description: 'Aggregating from every major DEX',
    delay: 0.2,
  },
  {
    icon: KeyRound,
    title: 'Google-Powered Security',
    highlight: 'MPC wallet technology',
    description: 'No seed phrases, just sign in',
    delay: 0.4,
  },
];

export function Features() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gradient">Features</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="glass-panel rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
              viewport={{ once: true }}
            >
              <feature.icon className="h-12 w-12 mb-6 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-lg font-medium text-blue-400 mb-2">
                {feature.highlight}
              </p>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}