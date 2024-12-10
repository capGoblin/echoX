import { NETWORK_CONFIG as CONFIG } from './config';
import { Node } from './node';

export function drawNode(
  ctx: CanvasRenderingContext2D,
  node: Node,
  pulse: number
) {
  const alpha = 0.3 + Math.sin(pulse * CONFIG.ANIMATION.PULSE_SPEED) * 0.1;
  
  // Draw node glow
  const gradient = ctx.createRadialGradient(
    node.x, node.y, 0,
    node.x, node.y, node.radius * 3
  );
  gradient.addColorStop(0, `rgba(${CONFIG.COLORS.PRIMARY}, ${alpha})`);
  gradient.addColorStop(1, `rgba(${CONFIG.COLORS.PRIMARY}, 0)`);
  
  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw node core
  ctx.beginPath();
  ctx.fillStyle = `rgba(${CONFIG.COLORS.PRIMARY}, ${alpha + 0.2})`;
  ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawConnection(
  ctx: CanvasRenderingContext2D,
  nodeA: Node,
  nodeB: Node,
  pulse: number
) {
  const distance = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
  if (distance > CONFIG.CONNECTION_DISTANCE) return;
  
  const alpha = (1 - distance / CONFIG.CONNECTION_DISTANCE) * 
                (0.1 + Math.sin(pulse * CONFIG.ANIMATION.FLOW_SPEED + distance * 0.01) * 0.05);
  
  // Create gradient along the connection
  const gradient = ctx.createLinearGradient(
    nodeA.x, nodeA.y,
    nodeB.x, nodeB.y
  );
  gradient.addColorStop(0, `rgba(${CONFIG.COLORS.PRIMARY}, ${alpha})`);
  gradient.addColorStop(0.5, `rgba(${CONFIG.COLORS.SECONDARY}, ${alpha * 1.5})`);
  gradient.addColorStop(1, `rgba(${CONFIG.COLORS.PRIMARY}, ${alpha})`);
  
  ctx.beginPath();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1;
  ctx.moveTo(nodeA.x, nodeA.y);
  ctx.lineTo(nodeB.x, nodeB.y);
  ctx.stroke();
}