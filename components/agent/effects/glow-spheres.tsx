'use client';

import { useEffect, useRef } from 'react';

interface GlowSphere {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  intensity: number;
}

export function GlowSpheres() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spheres: GlowSphere[] = Array.from({ length: 5 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 100 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      intensity: 0.1 + Math.random() * 0.2
    }));

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spheres.forEach(sphere => {
        // Update position
        sphere.x += sphere.vx;
        sphere.y += sphere.vy;

        // Bounce off edges
        if (sphere.x < -sphere.radius) sphere.x = canvas.width + sphere.radius;
        if (sphere.x > canvas.width + sphere.radius) sphere.x = -sphere.radius;
        if (sphere.y < -sphere.radius) sphere.y = canvas.height + sphere.radius;
        if (sphere.y > canvas.height + sphere.radius) sphere.y = -sphere.radius;

        // Draw glow sphere
        const gradient = ctx.createRadialGradient(
          sphere.x, sphere.y, 0,
          sphere.x, sphere.y, sphere.radius
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${sphere.intensity})`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${sphere.intensity * 0.5})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sphere.x, sphere.y, sphere.radius, 0, Math.PI * 2);
        ctx.fill();
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
      style={{ filter: 'blur(100px)' }}
    />
  );
}