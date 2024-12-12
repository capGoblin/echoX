import {
  EIP712TypedData,
  HashLock,
  NetworkEnum,
  SDK,
  SupportedChain,
} from "@1inch/cross-chain-sdk";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { randomBytes } from "crypto";
import { solidityPackedKeccak256 } from "ethers";

import { BlockchainProviderConnector } from "@1inch/cross-chain-sdk";
import { BrowserProvider, TransactionRequest } from "ethers";

interface Web3Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

class Web3AuthBlockchainProvider implements BlockchainProviderConnector {
  constructor(private web3authProvider: Web3Provider) {}

  async signTypedData(
    walletAddress: string,
    typedData: EIP712TypedData
  ): Promise<string> {
    const provider = new BrowserProvider(this.web3authProvider);
    const signer = await provider.getSigner(walletAddress);
    return signer.signTypedData(
      typedData.domain,
      typedData.types,
      typedData.message
    );
  }

  async ethCall(contractAddress: string, callData: string): Promise<string> {
    const provider = new BrowserProvider(this.web3authProvider);
    return provider.call({
      to: contractAddress,
      data: callData,
    });
  }

  async sendTransaction(tx: TransactionRequest): Promise<string> {
    const signer = new BrowserProvider(this.web3authProvider).getSigner();
    const txResponse = await (await signer).sendTransaction(tx);
    return txResponse.hash;
  }
}

const WEB3AUTH_CLIENT_ID =
  "BJbQWmZ8qIxWTgTNgvLHAFojPI-TBlHyl3UPfzHDA0e6xt1GxAg6QkS-yN0p-Lxw5Wv6AfvScvVLhY5eWX4fSUs";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x61",
  rpcTarget: "https://bsc-testnet-dataseed.bnbchain.org",
  displayName: "BNB Chain Testnet",
  blockExplorerUrl: "https://testnet.bscscan.com",
  blockExplorer: "https://testnet.bscscan.com",
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
});

await web3auth.initModal();

const web3authProvider = await web3auth.connect();

const customBlockchainProvider = new Web3AuthBlockchainProvider(
  web3authProvider!
);

const sdk = new SDK({
  url: "https://api.1inch.dev/fusion-plus",
  authKey: "your-auth-key", // Provide your 1inch API key
  blockchainProvider: customBlockchainProvider,
});

const makerAddress = "0xYourWalletAddress";

// const blockchainProvider = new PrivateKeyProviderConnector(
//   makerPrivateKey,
//   new Web3(nodeUrl)
// );

// const sdk = new SDK({
//   url: "https://api.1inch.dev/fusion-plus",
//   authKey: "your-auth-key",
//   blockchainProvider,
// });

const quoteParams = {
  srcChainId: NetworkEnum.ETHEREUM as SupportedChain, // Source chain
  dstChainId: NetworkEnum.GNOSIS as SupportedChain, // Destination chain
  srcTokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI on Ethereum
  dstTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // Native token (e.g., ETH) on Gnosis
  amount: "1000000000000000000000", // Amount in wei (1 DAI in this example)
};

const quote = await sdk.getQuote(quoteParams);
console.log("Quote Details:", quote);

const secretsCount = quote.getPreset().secretsCount;

const secrets = Array.from({ length: secretsCount }).map(() =>
  randomBytes(32).toString("hex")
);
const secretHashes = secrets.map((x) => HashLock.hashSecret(x));

const hashLock =
  secretsCount === 1
    ? HashLock.forSingleFill(secrets[0])
    : HashLock.forMultipleFills(
        secretHashes.map((secretHash, i) =>
          solidityPackedKeccak256(
            ["uint64", "bytes32"],
            [i, secretHash.toString()]
          )
        ) as (string & {
          _tag: "MerkleLeaf";
        })[]
      );

const orderParams = {
  walletAddress: makerAddress,
  hashLock,
  secretHashes,
  // fee: {
  //   takingFeeBps: 100, // 1% fee
  //   takingFeeReceiver: "0x0000000000000000000000000000000000000000",
  // },
};

sdk.placeOrder(quote, orderParams).then((result) => {
  console.log("Order Placed:", result);
});
