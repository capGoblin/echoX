'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Node, createNode } from './node';
import { drawNode, drawConnection } from './renderer';
import { updateNodePosition, updateConnections } from './physics';

export function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const pulseRef = useRef(0);
  const lastTimeRef = useRef(0);
  const frameIdRef = useRef<number | undefined>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      // Reinitialize nodes on resize
      nodesRef.current = Array.from(
        { length: Math.floor((rect.width * rect.height) / 50000) },
        () => createNode(rect.width, rect.height)
      );
    };

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      pulseRef.current += 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update physics
      nodesRef.current.forEach(node => {
        updateNodePosition(node, canvas.width, canvas.height, deltaTime);
      });
      updateConnections(nodesRef.current);
      
      // Draw connections first (behind nodes)
      nodesRef.current.forEach(node => {
        node.connections.forEach(other => {
          drawConnection(ctx, node, other, pulseRef.current);
        });
      });
      
      // Draw nodes
      nodesRef.current.forEach(node => {
        drawNode(ctx, node, pulseRef.current);
      });

      frameIdRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
}