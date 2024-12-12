"use client";

import { useEffect, useRef } from "react";

interface FloatingObject {
  x: number;
  y: number;
  size: number;
  speed: number;
  blur: number;
  opacity: number;
  color: string;
}

export function FloatingObjects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize floating objects
    const objects: FloatingObject[] = Array.from({ length: 15 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 20 + Math.random() * 80,
      speed: 0.2 + Math.random() * 0.3,
      blur: 20 + Math.random() * 30,
      opacity: 0.1 + Math.random() * 0.2,
      color: [
        "rgba(59, 130, 246, 1)", // blue-500
        "rgba(37, 99, 235, 1)", // blue-600
        "rgba(29, 78, 216, 1)", // blue-700
      ][Math.floor(Math.random() * 3)],
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

      objects.forEach((obj) => {
        // Update position
        obj.y -= obj.speed;
        if (obj.y + obj.size < 0) {
          obj.y = canvas.height + obj.size;
          obj.x = Math.random() * canvas.width;
        }

        // Draw blurred object
        ctx.save();
        ctx.filter = `blur(${obj.blur}px)`;
        ctx.globalAlpha = obj.opacity;

        // Create gradient
        const gradient = ctx.createRadialGradient(
          obj.x,
          obj.y,
          0,
          obj.x,
          obj.y,
          obj.size
        );
        gradient.addColorStop(0, obj.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ filter: "blur(60px)" }}
    />
  );
}
