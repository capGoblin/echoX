'use client';

import { useEffect, useRef } from 'react';

interface TokenBubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  symbol: string;
}

const TOKENS = [
  { symbol: 'ETH', color: '#627EEA' },
  { symbol: 'BTC', color: '#F7931A' },
  { symbol: 'USDT', color: '#26A17B' },
  { symbol: 'BNB', color: '#F3BA2F' },
  { symbol: 'SOL', color: '#14F195' },
];

export function TokenBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bubbles: TokenBubble[] = Array.from({ length: 15 }, () => {
      const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 30 + Math.random() * 20,
        speed: 0.2 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: token.color,
        symbol: token.symbol,
      };
    });

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const drawBubble = (bubble: TokenBubble) => {
      ctx.save();
      ctx.translate(bubble.x, bubble.y);
      ctx.rotate(bubble.rotation);

      // Draw circle
      ctx.beginPath();
      ctx.arc(0, 0, bubble.size, 0, Math.PI * 2);
      ctx.fillStyle = `${bubble.color}22`;
      ctx.fill();
      ctx.strokeStyle = `${bubble.color}44`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw token symbol
      ctx.fillStyle = `${bubble.color}cc`;
      ctx.font = `${bubble.size * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bubble.symbol, 0, 0);

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach(bubble => {
        // Update position
        bubble.y -= bubble.speed;
        bubble.rotation += bubble.rotationSpeed;

        // Reset position when bubble goes off screen
        if (bubble.y + bubble.size < 0) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * canvas.width;
        }

        // Draw bubble
        drawBubble(bubble);
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
    />
  );
}