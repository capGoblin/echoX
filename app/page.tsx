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
