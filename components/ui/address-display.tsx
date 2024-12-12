"use client";

import { useEffect, useRef } from "react";
import { createIcon } from "@download/blockies";

interface AddressDisplayProps {
  address: string;
  className?: string;
}

export function AddressDisplay({ address, className }: AddressDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !address) return;

    const icon = createIcon({
      seed: address.toLowerCase(),
      size: 8,
      scale: 4,
      color: "#3B82F6", // Blue to match theme
      bgcolor: "#0D0F12", // Dark background to match theme
      spotcolor: "#60A5FA", // Lighter blue for spots
    });

    // Clear previous content
    const ctx = canvasRef.current.getContext("2d");
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw new blockie
    canvasRef.current.replaceWith(icon);
    icon.id = canvasRef.current.id;
    icon.className = canvasRef.current.className;
    canvasRef.current = icon;
  }, [address]);

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.05] transition-colors ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-6 h-6 rounded-full"
        width="32"
        height="32"
      />
      <span className="text-sm text-muted-foreground">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
    </div>
  );
}
