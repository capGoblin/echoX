"use client";

import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
import { sepolia, bscTestnet } from "viem/chains";
import { ethers, parseUnits } from "ethers";
import { getEthersSigner } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { Suspense } from "react";
import { Nav } from "@/components/home/nav";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Footer } from "@/components/home/footer";
import { BackgroundEffects } from "@/components/visuals/background-effects";

export default function Home() {
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

  useEffect(() => {
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

      console.log(privateKeyProvider);
      // privateKeyProvider.addChain(chainConfig);

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
      console.log(web3auth);
      console.log(privateKeyProvider);
    };

    initWeb3Auth();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Suspense fallback={null}>
        <BackgroundEffects />
      </Suspense>
      <div className="relative z-10">
        <Nav />
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
      </div>
    </main>
  );
}
