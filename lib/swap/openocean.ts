import axios from "axios";

interface TokenQuoteInfo {
  symbol: string;
  usd: string;
  decimals: number;
}

interface QuoteResponse {
  code: number;
  data: {
    inToken: TokenQuoteInfo;
    outToken: TokenQuoteInfo;
    inAmount: string;
    outAmount: string;
    estimatedGas: string;
    price_impact: string;
  };
}

interface SwapResponse {
  code: number;
  data: {
    from: string;
    to: string;
    value: string;
    estimatedGas: number;
    minOutAmount: string;
    data: string;
  };
}

interface SwapQuoteParams {
  chain: string;
  inTokenAddress: string;
  outTokenAddress: string;
  amount: string;
  gasPrice: string;
  slippage?: string;
  account: string;
  disabledDexIds?: string;
  enabledDexIds?: string;
  referrer?: string;
  referrerFee?: number;
}

/**
 * Get a quote for token swap
 */
export async function getSwapQuote(
  chain: string,
  inTokenAddress: string,
  outTokenAddress: string,
  amount: string,
  gasPrice: string,
  options?: {
    slippage?: string;
    disabledDexIds?: string;
    enabledDexIds?: string;
  }
): Promise<QuoteResponse> {
  const url = `https://open-api.openocean.finance/v3/${chain}/quote`;

  try {
    const response = await axios.get<QuoteResponse>(url, {
      params: {
        inTokenAddress,
        outTokenAddress,
        amount,
        gasPrice,
        ...options,
      },
    });

    if (response.data.code !== 200) {
      throw new Error(`Quote error: ${response.data.code}`);
    }
    return response.data;
  } catch (error) {
    console.error("Failed to get swap quote:", error);
    throw error;
  }
}

/**
 * Get swap transaction data
 */
export async function getSwapTransaction(
  params: SwapQuoteParams
): Promise<SwapResponse> {
  const url = `https://open-api.openocean.finance/v3/${params.chain}/swap_quote`;

  try {
    const response = await axios.get<SwapResponse>(url, { params });

    if (response.data.code !== 200) {
      throw new Error(`Swap quote error: ${response.data.code}`);
    }
    return response.data;
  } catch (error) {
    console.error("Failed to get swap transaction:", error);
    throw error;
  }
}

// Example usage:
/*
// 1. Get quote
const quote = await getSwapQuote(
  'bsc',
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // BNB
  '0x55d398326f99059ff775485246999027b3197955', // USDT
  '5',
  '3',
  { slippage: '1' }
);

// 2. Get swap transaction
const swapTx = await getSwapTransaction({
  chain: 'bsc',
  inTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  outTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
  amount: '5',
  gasPrice: '3',
  slippage: '1',
  account: '0x929B44e589AC4dD99c0282614e9a844Ea9483aaa'
});
*/
