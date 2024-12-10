import axios from "axios";

interface Asset {
  ids: string;
  name: string;
  address: string;
  decimals: number;
  icon: string;
  symbol: string;
  chain: string;
  chainId: string;
}

interface BridgeInfo {
  serviceTime: number;
  displayName: string;
  icon: string;
  code: string;
}

interface BridgeRoute {
  bridgeId: number;
  tokenReceiver: string;
  bridgeInfo: BridgeInfo;
  fromAsset: Asset;
  fromChainId: string;
  toAsset: Asset;
  toChainId: string;
  inputAmount: string;
  outputAmount: string;
}

interface Route {
  isApprovalRequired: boolean;
  allowanceTarget: string;
  bridgeRoute: BridgeRoute;
  fees: {
    gasLimit: Array<{
      chainId: number;
      name: string;
      symbol: string;
      address: string;
      decimals: number;
      logoURI: string;
      amount: string;
      value: string;
    }>;
    bridgeFee: {
      symbol: string;
      amount: string;
      value: string;
    };
  };
  type: number;
}

interface QuoteResponse {
  code: number;
  data: {
    fromAsset: Asset;
    toAsset: Asset;
    fromChainId: string;
    toChainId: string;
    routes: Route[];
  };
}

interface SwapResponse {
  code: number;
  data: {
    from: string;
    to: string;
    data: string;
    value: string;
  };
}

interface CrossChainStatus {
  code: number;
  data: {
    status: number; // 2-fail, 3-pending, 5-success
    outAmount: string; // destination amount with decimals
    destHash: string; // destination chain transaction hash
    swapHash?: string; // swap transaction hash (if destination chain needs swap)
    swapStatus?: number; // swap status
  };
}

/**
 * Get a quote for cross-chain transfer
 */
export async function getCrossChainQuote(
  fromSymbol: string,
  fromChainId: number,
  toSymbol: string,
  toChainId: number,
  amount: string
): Promise<QuoteResponse> {
  const url =
    `https://open-api.openocean.finance/cross_chain/v1/cross/quoteByOO?` +
    `fromSymbol=${fromSymbol}` +
    `&fromChainId=${fromChainId}` +
    `&toSymbol=${toSymbol}` +
    `&toChainId=${toChainId}` +
    `&amount=${amount}`;

  try {
    const response = await axios.get<QuoteResponse>(url);
    if (response.data.code !== 200) {
      throw new Error(`Quote error: ${response.data.code}`);
    }

    // Filter out null routes
    response.data.data.routes = response.data.data.routes.filter(
      (route): route is Route => route !== null
    );

    return response.data;
  } catch (error) {
    console.error("Failed to get cross-chain quote:", error);
    throw error;
  }
}

/**
 * Execute a cross-chain swap
 */
export async function executeCrossChainSwap(
  account: string,
  route: Route
): Promise<SwapResponse> {
  // Get the bridge platform from the route
  const platform = route.bridgeRoute.bridgeInfo.code;
  const url = `https://open-api.openocean.finance/cross_chain/v1/cross/${
    platform || "stargate"
  }/swap`;

  try {
    const response = await axios.post<SwapResponse>(url, {
      account,
      route,
    });

    if (response.data.code !== 200) {
      throw new Error(`Swap error: ${response.data.code}`);
    }
    return response.data;
  } catch (error) {
    console.error("Failed to execute cross-chain swap:", error);
    throw error;
  }
}

/**
 * Monitor cross-chain transaction status
 * @param chainId Source chain ID
 * @param hash Transaction hash
 * @returns Transaction status details
 */
export async function getCrossChainStatus(
  chainId: number,
  hash: string
): Promise<CrossChainStatus> {
  const url =
    `https://open-api.openocean.finance/cross_chain/v1/cross/getCrossStatus?` +
    `chainId=${chainId}` +
    `&hash=${hash}`;

  try {
    const response = await axios.get<CrossChainStatus>(url);
    return response.data;
  } catch (error) {
    console.error("Failed to get cross-chain status:", error);
    throw error;
  }
}

// Status constants for better readability
export const CrossChainStatusTypes = {
  FAILED: 2,
  PENDING: 3,
  SUCCESS: 5,
} as const;
