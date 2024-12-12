"use client";

import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const generateChartData = () => {
  return Array.from({ length: 20 }, () => ({
    value: Math.random() * 100,
  }));
};

const metrics = [
  {
    label: "Total Value Optimized",
    value: "$2.5B+",
    change: "+12.5%",
    data: generateChartData(),
  },
  {
    label: "Cross-Chain Transactions",
    value: "1.2M+",
    change: "+8.3%",
    data: generateChartData(),
  },
  {
    label: "Average User Savings",
    value: "32.5%",
    change: "+5.2%",
    data: generateChartData(),
  },
  {
    label: "Active Network Connections",
    value: "15,234",
    change: "+15.7%",
    data: generateChartData(),
  },
];

function MetricCard({
  metric,
  index,
}: {
  metric: (typeof metrics)[0];
  index: number;
}) {
  const [data, setData] = useState(metric.data);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((currentData) => [
        ...currentData.slice(1),
        { value: Math.random() * 100 },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="glass-panel rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="mb-4">
        <h3 className="text-sm text-muted-foreground">{metric.label}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gradient">
            {metric.value}
          </span>
          <span className="text-sm text-emerald-500">{metric.change}</span>
        </div>
      </div>

      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function LiveMetrics() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-gradient">Real-Time Intelligence</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
