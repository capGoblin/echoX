'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const throttleRef = useRef<number>();

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (throttleRef.current) return;

      throttleRef.current = window.setTimeout(() => {
        throttleRef.current = undefined;
      }, 16); // ~60fps throttle

      requestAnimationFrame(() => {
        if (!glow) return;
        const rect = glow.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        glow.style.background = `
          radial-gradient(
            800px circle at ${x}px ${y}px,
            rgba(59, 130, 246, 0.05),
            transparent 60%
          )
        `;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={glowRef}
      className="fixed inset-0 pointer-events-none transition-[background] duration-300 ease-out"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}