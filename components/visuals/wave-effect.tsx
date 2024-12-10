'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function WaveEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 5) {
          const y = Math.sin(x * 0.003 + time + i) * 50 + 
                   Math.sin(x * 0.001 + time + i) * 30;
          
          const offsetY = canvas.height / 2 + y;
          
          if (x === 0) {
            ctx.moveTo(x, offsetY);
          } else {
            ctx.lineTo(x, offsetY);
          }
        }
        
        ctx.stroke();
      }

      time += 0.005;
      animationFrameId = requestAnimationFrame(drawWave);
    };

    resizeCanvas();
    drawWave();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 -z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}