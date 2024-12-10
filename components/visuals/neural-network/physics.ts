import { Node } from './node';

export function updateNodePosition(
  node: Node,
  width: number,
  height: number,
  deltaTime: number
) {
  // Update position
  node.x += node.vx * deltaTime;
  node.y += node.vy * deltaTime;
  
  // Bounce off walls
  if (node.x < 0 || node.x > width) node.vx *= -1;
  if (node.y < 0 || node.y > height) node.vy *= -1;
  
  // Keep within bounds
  node.x = Math.max(0, Math.min(width, node.x));
  node.y = Math.max(0, Math.min(height, node.y));
  
  // Add slight random movement
  node.vx += (Math.random() - 0.5) * 0.01;
  node.vy += (Math.random() - 0.5) * 0.01;
  
  // Limit velocity
  const speed = Math.hypot(node.vx, node.vy);
  if (speed > 1) {
    node.vx = (node.vx / speed) * 1;
    node.vy = (node.vy / speed) * 1;
  }
}

export function updateConnections(nodes: Node[]) {
  nodes.forEach(node => {
    node.connections = nodes.filter(other => {
      if (node === other) return false;
      const distance = Math.hypot(node.x - other.x, node.y - other.y);
      return distance < 150;
    });
  });
}