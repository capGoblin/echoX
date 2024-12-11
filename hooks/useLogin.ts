import { useRouter } from "next/navigation";
import { createWalletClient, custom } from "viem";
import { bscTestnet } from "viem/chains";
import { useStore } from "@/store/useStore";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";

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
    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x61",
      rpcTarget: "https://bsc-testnet-dataseed.bnbchain.org",
      displayName: "BNB Chain Testnet",
      blockExplorerUrl: "https://testnet.bscscan.com",
      ticker: "tBNB",
      tickerName: "BNB",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    };

    const privateKeyProvider = new EthereumPrivateKeyProvider({
      config: { chainConfig },
    });

    const web3auth = new Web3Auth({
      clientId: WEB3AUTH_CLIENT_ID,
      privateKeyProvider,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      uiConfig: {
        primaryButton: "socialLogin",
        mode: "dark",
      },
    });

    await web3auth.initModal();
    setWeb3Auth(web3auth);
    return web3auth;
  };

  const connectWeb3Auth = async (web3auth: Web3Auth) => {
    const web3authProvider = await web3auth.connect();
    setWeb3AuthProvider(web3authProvider!);

    const provider = createWalletClient({
      chain: bscTestnet,
      transport: custom(web3authProvider!),
    });

    setProvider(provider);
    const signer = await provider.getAddresses();
    setSigner(signer);
    router.push("/agent");
  };

  const handleLogin = async () => {
    try {
      const auth = web3auth || await initWeb3Auth();
      await connectWeb3Auth(auth);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return { handleLogin };
}
