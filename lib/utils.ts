import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IProvider } from "@web3auth/base";
import { BrowserProvider } from "ethers";
import { parseUnits, ethers } from "ethers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const approveToken = async (
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  decimals: number = 18,
  web3authProvider: IProvider
) => {
  const ERC20_ABI = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
  ];

  if (!web3authProvider) {
    throw new Error("Provider not initialized");
  }

  const provider = new BrowserProvider(web3authProvider);
  const signer = await provider.getSigner();

  // Create contract instance
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

  // Convert amount to proper decimal places
  const amountInWei = parseUnits(amount, decimals);

  // Send approve transaction
  const tx = await tokenContract.approve(spenderAddress, amountInWei);
  console.log("Approval transaction hash:", tx.hash);

  // Wait for transaction to be mined
  await tx.wait();
  console.log("Approval confirmed");
};

export const getEthersSigner = async (web3authProvider: IProvider) => {
  if (!web3authProvider) {
    throw new Error("Provider not initialized");
  }

  const provider = new BrowserProvider(web3authProvider);
  const signer = await provider.getSigner();

  const tx = await signer.sendTransaction({
    to: "0xef9C9e03d8cF4fb38D8Ce3d44A956b21aC4bF90b",
    value: ethers.parseEther("0.001"),
  });

  console.log("Transaction hash:", tx.hash);
  return signer;
};




// const chain2Config = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0xaa36a7",
//   rpcTarget: "https://ethereum-sepolia-rpc.publicnode.com",
//   displayName: "Ethereum Sepolia Testnet",
//   blockExplorerUrl: "https://sepolia.etherscan.io",
//   ticker: "ETH",
//   tickerName: "Ethereum",
//   logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
// };

// const hash = await provider.sendTransaction({
//   account: signer[0]!,
//   to: "0xef9C9e03d8cF4fb38D8Ce3d44A956b21aC4bF90b",
//   value: BigInt(0.001 * 10 ** 18),
// });
// console.log(hash);
