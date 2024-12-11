import { useRouter } from "next/navigation";
import { createWalletClient, custom } from "viem";
import { bscTestnet } from "viem/chains";
import { useStore } from "@/store/useStore";

export function useLogin() {
  const { web3auth, setWeb3AuthProvider, setProvider } = useStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!web3auth) return;
    try {
      await web3auth.connect();
      const web3authProvider = await web3auth.connect();
      setWeb3AuthProvider(web3authProvider!);

      const provider = createWalletClient({
        chain: bscTestnet,
        transport: custom(web3authProvider!),
      });

      setProvider(provider);
      console.log(web3authProvider);

      // @ts-ignore
      const signer = await provider.getAddresses();
      console.log(signer);
      console.log(provider);
      router.push("/agent");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return { handleLogin };
} 