import { TokenBubble } from './types';
import { TOKENS, BUBBLE_CONFIG } from './config';

export function createBubble(width: number, height: number): TokenBubble {
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: BUBBLE_CONFIG.SIZE.MIN + Math.random() * (BUBBLE_CONFIG.SIZE.MAX - BUBBLE_CONFIG.SIZE.MIN),
    speed: BUBBLE_CONFIG.SPEED.MIN + Math.random() * (BUBBLE_CONFIG.SPEED.MAX - BUBBLE_CONFIG.SPEED.MIN),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * BUBBLE_CONFIG.ROTATION.MAX_SPEED,
    color: token.color,
    symbol: token.symbol,
  };
}

export function drawBubble(ctx: CanvasRenderingContext2D, bubble: TokenBubble) {
  ctx.save();
  ctx.translate(bubble.x, bubble.y);
  ctx.rotate(bubble.rotation);

  // Draw outer glow
  ctx.filter = `blur(${BUBBLE_CONFIG.BLUR.GLOW}px)`;
  ctx.beginPath();
  ctx.arc(0, 0, bubble.size * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = `${bubble.color}${Math.round(BUBBLE_CONFIG.OPACITY.GLOW * 255).toString(16).padStart(2, '0')}`;
  ctx.fill();

  // Draw blurred bubble background
  ctx.filter = `blur(${BUBBLE_CONFIG.BLUR.BUBBLE}px)`;
  ctx.beginPath();
  ctx.arc(0, 0, bubble.size, 0, Math.PI * 2);
  ctx.fillStyle = `${bubble.color}${Math.round(BUBBLE_CONFIG.OPACITY.BUBBLE * 255).toString(16).padStart(2, '0')}`;
  ctx.fill();

  // Draw token symbol with less blur
  ctx.filter = `blur(${BUBBLE_CONFIG.BLUR.TEXT}px)`;
  ctx.fillStyle = `${bubble.color}${Math.round(BUBBLE_CONFIG.OPACITY.TEXT * 255).toString(16).padStart(2, '0')}`;
  ctx.font = `${bubble.size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(bubble.symbol, 0, 0);

  ctx.restore();
}