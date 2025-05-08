"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const WalletConnectButton = () => {
  return (
    <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-white !font-bold !py-2 !px-4 !rounded" />
  );
};

export default WalletConnectButton;