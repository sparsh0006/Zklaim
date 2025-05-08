"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { getMerkleProof } from "../lib/merkletree"; // Updated import path

interface ClaimFormProps {
  eventId: string;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ eventId }) => {
  const { publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [allowlistInput, setAllowlistInput] = useState<string>("");

  const handleClaim = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet to claim.");
      return;
    }
    if (!allowlistInput.trim()) {
        setError("Please provide the event's allowlist to generate your proof.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setTransactionSignature(null);

    const allowlistArray = allowlistInput
        .split(/[\n,]+/)
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0);

    if (allowlistArray.length === 0) {
        setError("Allowlist seems empty. Cannot generate proof.");
        setIsLoading(false);
        return;
    }

    let merkleProof: string[] | null = null;
    try {
      merkleProof = getMerkleProof(allowlistArray, publicKey.toBase58());
      if (!merkleProof) {
        if (!allowlistArray.includes(publicKey.toBase58())) {
             throw new Error("Your address is not in the provided allowlist. Cannot generate proof.");
        }
        throw new Error("Could not generate Merkle proof. Ensure your address is in the allowlist and the allowlist is correct.");
      }
    } catch (err: any) {
      setError(`Proof generation error: ${err.message}`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/claim/${eventId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attendeeAddress: publicKey.toBase58(),
            merkleProof: merkleProof,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to claim token");
      }
      setSuccessMessage(data.message || "POPPass Claimed!");
      if (data.transactionSignature) {
        setTransactionSignature(data.transactionSignature);
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during claim.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Claim POPPass for Event: <span className="font-mono text-purple-600">{eventId}</span>
      </h2>

      {!connected && <p className="text-center text-yellow-600">Please connect your wallet to proceed.</p>}

      {connected && publicKey && (
        <div className="space-y-4">
          <div>
            <label htmlFor="allowlistForProof" className="block text-sm font-medium text-gray-700 mb-1">
              <strong>Important:</strong> Paste the event's original allowlist below (comma or newline separated).
              This is needed to generate your unique proof.
            </label>
            <textarea
              id="allowlistForProof"
              value={allowlistInput}
              onChange={(e) => setAllowlistInput(e.target.value)}
              rows={5}
              placeholder="WalletAddress1, WalletAddress2, ..."
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            onClick={handleClaim}
            disabled={isLoading || !publicKey || !allowlistInput.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? "Claiming..." : "Claim POPPass"}
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
      {successMessage && (
        <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-md text-center">
          <p className="text-md font-medium text-green-700">{successMessage}</p>
          {transactionSignature && (
            <p className="mt-1 text-sm">
              Transaction:{" "}
              <a
                href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=${process.env.NEXT_PUBLIC_HELIUS_RPC_URL?.includes("devnet") ? "devnet" : process.env.NEXT_PUBLIC_HELIUS_RPC_URL?.includes("testnet") ? "testnet" : "mainnet-beta"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View on Explorer
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimForm;