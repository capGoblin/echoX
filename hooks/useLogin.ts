import { useRouter } from "next/navigation";
import { createWalletClient, custom } from "viem";
import { bsc, base, polygon } from "viem/chains";
import { useStore } from "@/store/useStore";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";

const CHAIN_CONFIG = {
  bsc: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x38", // 56
    rpcTarget: "https://bsc-dataseed.bnbchain.org",
    displayName: "BNB Smart Chain",
    blockExplorerUrl: "https://bscscan.com/",
    ticker: "BNB",
    tickerName: "BNB",
  },
  base: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x2105", // 8453
    rpcTarget: "https://mainnet.base.org",
    displayName: "Base",
    blockExplorerUrl: "https://basescan.org",
    ticker: "ETH",
    tickerName: "ETH",
  },
  polygon: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x89", // 137
    rpcTarget: "https://polygon-rpc.com",
    displayName: "Polygon",
    blockExplorerUrl: "https://polygonscan.com",
    ticker: "MATIC",
    tickerName: "MATIC",
  },
};

export function useLogin() {
  const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;
  const {
    web3auth,
    web3authProvider,
    provider,
    signer,
    setWeb3Auth,
    setWeb3AuthProvider,
    setProvider,
    setSigner,
    reset,
  } = useStore();
  const router = useRouter();

  const initWeb3Auth = async () => {
    const privateKeyProvider = new EthereumPrivateKeyProvider({
      config: { chainConfig: CHAIN_CONFIG.base },
    });

    const web3auth = new Web3Auth({
      clientId: WEB3AUTH_CLIENT_ID,
      privateKeyProvider,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      uiConfig: {
        primaryButton: "socialLogin",
        mode: "dark",
      },
      chainConfig: CHAIN_CONFIG.base,
    });

    await web3auth.initModal();

    // await web3auth.switchChain(CHAIN_CONFIG.base);
    setWeb3Auth(web3auth);
    return web3auth;
  };

  const connectWeb3Auth = async (web3auth: Web3Auth) => {
    const web3authProvider = await web3auth.connect();
    setWeb3AuthProvider(web3authProvider!);

    const provider = createWalletClient({
      chain: base,
      transport: custom(web3authProvider!),
    });

    setProvider(provider);
    const signer = await provider.getAddresses();
    setSigner(signer);
    router.push("/agent");
  };

  const handleLogin = async () => {
    try {
      const auth = web3auth || (await initWeb3Auth());
      await connectWeb3Auth(auth);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return { handleLogin };
}
