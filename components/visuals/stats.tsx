'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  { label: 'Cross-Chain Trades', value: 0, target: 1234567 },
  { label: 'Gas Saved (USD)', value: 0, target: 987654 },
  { label: 'Total Volume', value: 0, target: 5432198 },
];

export function Stats() {
  const [values, setValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues((prev) =>
        prev.map((value, i) => {
          const target = stats[i].target;
          const step = Math.ceil(target / 100);
          return Math.min(value + step, target);
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 grid grid-cols-1 md:grid-cols-3 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {stats.map(({ label }, i) => (
        <div
          key={label}
          className="glass-panel rounded-xl p-6 text-center animate-float"
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          <div className="text-2xl font-bold text-gradient">
            {new Intl.NumberFormat().format(values[i])}
          </div>
          <div className="text-sm text-muted-foreground mt-2">{label}</div>
        </div>
      ))}
    </motion.div>
  );
}