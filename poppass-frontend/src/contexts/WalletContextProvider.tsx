"use client";

import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

interface WalletProps {
  children: ReactNode;
}

const WalletContextProvider: FC<WalletProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet; // Or Devnet/Testnet based on your Helius endpoint

  const endpoint = useMemo(() => {
    const heliusRpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL;
    if (!heliusRpcUrl) {
      console.error("Helius RPC URL is not set in environment variables!");
      throw new Error("NEXT_PUBLIC_HELIUS_RPC_URL is not defined. Please set it in your .env.local file.");
    }
    return heliusRpcUrl;
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;