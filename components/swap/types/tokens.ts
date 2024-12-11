export interface Token {
  symbol: string;
  name: string;
  icon: string;
  logoURI: string;
  address?: string;
  decimals: number;
}

export interface Chain {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  logoURI: string;
}

export const CHAINS: Chain[] = [
  {
    id: "bsc",
    name: "BNB Chain",
    symbol: "BSC",
    icon: "🟡",
    logoURI:
      "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  },
  {
    id: "base",
    name: "Base",
    symbol: "BASE",
    icon: "🔵",
    logoURI: "https://assets.coingecko.com/coins/images/32619/small/base.png",
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "POL",
    icon: "🟣",
    logoURI:
      "https://assets.coingecko.com/coins/images/2784/small/polymath-network_small.png",
  },
] as const;
export const TOKENS = {
  bsc: [
    {
      symbol: "BNB",
      name: "BNB",
      icon: "🟡",
      logoURI:
        "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Native BNB
      decimals: 18,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      icon: "💵",
      logoURI: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // BSC USDC
      decimals: 18,
    },
  ],
  base: [
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: "💠",
      logoURI:
        "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Native ETH
      decimals: 18,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      icon: "💵",
      logoURI: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
      decimals: 6,
    },
  ],
  polygon: [
    {
      symbol: "POL",
      name: "Polygon",
      icon: "🟣",
      logoURI:
        "https://assets.coingecko.com/coins/images/2784/small/polymath-network_small.png",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Native ETH
      decimals: 18,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      icon: "💵",
      logoURI: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
      decimals: 6,
    },
  ],
} as const;
