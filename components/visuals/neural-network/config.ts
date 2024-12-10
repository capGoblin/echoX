export const NETWORK_CONFIG = {
  NODE_COUNT_FACTOR: 50000, // Higher number = fewer nodes
  MAX_SPEED: 1,
  CONNECTION_DISTANCE: 150,
  NODE_SIZE: {
    MIN: 2,
    MAX: 4,
  },
  COLORS: {
    PRIMARY: '59, 130, 246', // Blue
    SECONDARY: '96, 165, 250', // Lighter blue
  },
  ANIMATION: {
    PULSE_SPEED: 0.05,
    FLOW_SPEED: 0.03,
  },
} as const;