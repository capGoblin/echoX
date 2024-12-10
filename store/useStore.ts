import { create } from "zustand";
import { Web3Auth } from "@web3auth/modal";
import { WalletClient, Address } from "viem";

interface Web3AuthState {
  web3auth: Web3Auth | null;
  web3authProvider: any;
  provider: WalletClient | null;
  signer: Address[] | null;
  setWeb3Auth: (web3auth: Web3Auth) => void;
  setWeb3AuthProvider: (provider: any) => void;
  setProvider: (provider: WalletClient) => void;
  setSigner: (signer: Address[]) => void;
  reset: () => void;
}

export const useStore = create<Web3AuthState>((set) => ({
  web3auth: null,
  web3authProvider: null,
  provider: null,
  signer: null,
  setWeb3Auth: (web3auth) => set({ web3auth }),
  setWeb3AuthProvider: (web3authProvider) => set({ web3authProvider }),
  setProvider: (provider) => set({ provider }),
  setSigner: (signer) => set({ signer }),
  reset: () =>
    set({
      web3auth: null,
      web3authProvider: null,
      provider: null,
      signer: null,
    }),
}));
