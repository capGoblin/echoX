import { NETWORK_CONFIG as CONFIG } from './config';

export interface Node {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  connections: Node[];
}

export function createNode(width: number, height: number): Node {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: CONFIG.NODE_SIZE.MIN + Math.random() * (CONFIG.NODE_SIZE.MAX - CONFIG.NODE_SIZE.MIN),
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    connections: [],
  };
}