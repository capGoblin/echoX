export const TOKENS = [
  { symbol: 'ETH', color: '#627EEA' },
  { symbol: 'BTC', color: '#F7931A' },
  { symbol: 'USDT', color: '#26A17B' },
  { symbol: 'BNB', color: '#F3BA2F' },
  { symbol: 'SOL', color: '#14F195' },
] as const;

export const BUBBLE_CONFIG = {
  COUNT: 15,
  SIZE: {
    MIN: 30,
    MAX: 50,
  },
  SPEED: {
    MIN: 0.2,
    MAX: 0.5,
  },
  ROTATION: {
    MAX_SPEED: 0.02,
  },
  BLUR: {
    BUBBLE: 8,    // Increased blur for the bubble
    TEXT: 1,      // Kept text relatively sharp for readability
    GLOW: 15,     // Added glow blur
  },
  OPACITY: {
    BUBBLE: 0.15, // Reduced bubble opacity
    TEXT: 0.8,    // Kept text relatively visible
    GLOW: 0.1,    // Added subtle glow
  },
} as const;