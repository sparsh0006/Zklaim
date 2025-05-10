"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { getMerkleProof } from "../lib/merkletree";
import Image from 'next/image'; // Import Next.js Image component

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
    // Only require allowlist input if a pass hasn't been successfully claimed yet in this session
    if (!transactionSignature && !allowlistInput.trim()) {
        setError("Please provide the event's original allowlist to generate your proof.");
        return;
    }

    setIsLoading(true);
    setError(null);
    // Only clear previous success if we are attempting a new claim (i.e., no tx signature yet)
    if (!transactionSignature) {
        setSuccessMessage(null);
    }

    // Only proceed with proof generation and API call if not already claimed
    if (!transactionSignature) {
        const allowlistArray = allowlistInput
            .split(/[\n,]+/)
            .map(addr => addr.trim())
            .filter(addr => addr.length > 0);

        if (allowlistArray.length === 0) {
            setError("Allowlist appears to be empty. Cannot generate proof.");
            setIsLoading(false);
            return;
        }

        let merkleProof: string[] | null = null;
        try {
          merkleProof = getMerkleProof(allowlistArray, publicKey.toBase58());
          if (!merkleProof) {
            if (!allowlistArray.includes(publicKey.toBase58())) {
                 throw new Error("Your address is not in the provided allowlist. Proof cannot be generated.");
            }
            throw new Error("Could not generate Merkle proof. Please ensure the allowlist is correct and your address is included.");
          }
        } catch (err: any) {
          setError(`Proof generation error: ${err.message}`);
          setIsLoading(false);
          return;
        }

        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          if (!backendUrl) {
            throw new Error("Backend URL is not configured in your environment!");
          }
          const apiUrl = `${backendUrl}/api/claim/${eventId}`;

          const response = await fetch(
            apiUrl,
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
            throw new Error(data.message || "Failed to claim token. Please try again.");
          }

          setSuccessMessage(data.message || "POPPass Claimed Successfully!");
          if (data.transactionSignature) {
            setTransactionSignature(data.transactionSignature);
          }
        } catch (err: any) {
          setError(err.message || "An unknown error occurred while trying to claim.");
        } finally {
          setIsLoading(false);
        }
    } else {
        // If already claimed, just ensure loading state is false
        setIsLoading(false);
    }
  };

  // Consistent theme classes for inputs and labels (Solana Greenish-Purple Theme)
  const inputBaseClasses = "w-full bg-gp-input-bg border border-gp-border text-gp-text-light placeholder-gp-text-secondary rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gp-bright-green focus:border-transparent transition-colors duration-300 shadow-sm backdrop-blur-sm";
  const labelBaseClasses = "block text-sm font-medium text-gp-bright-green mb-1.5";

  return (
    <div className="bg-gp-card-bg shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gp-border backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-1 text-center text-white">
        {transactionSignature ? "Solana Accelerate Pass" : "Claim POPPass for Event:"}
      </h2>

      {!transactionSignature && ( // Only show Event ID if not yet claimed
            <p
                className="font-mono text-gp-bright-green text-center text-lg block overflow-hidden text-ellipsis whitespace-nowrap max-w-[220px] sm:max-w-xs md:max-w-sm mx-auto mb-6"
                title={eventId}
            >
                {eventId}
            </p>
        )}

      {!connected && (
        <p className="text-center text-gp-mid-violet py-4 font-semibold">Please connect your wallet to proceed.</p>
      )}

      {connected && publicKey && (
        <>
          {!transactionSignature ? (
            // Show Allowlist input and Claim button if pass has NOT been claimed yet
            <div className="space-y-4">
              <div>
                <label htmlFor="allowlistForProof" className={`${labelBaseClasses} text-left`}>
                  <strong>Important:</strong> Paste the event's original allowlist (comma or newline separated). This is needed to generate your unique proof.
                </label>
                <textarea
                  id="allowlistForProof"
                  value={allowlistInput}
                  onChange={(e) => setAllowlistInput(e.target.value)}
                  rows={4}
                  placeholder="WalletAddress1, WalletAddress2, ..."
                  className={`${inputBaseClasses} min-h-[100px] mt-1`}
                  required
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleClaim}
                disabled={isLoading || !publicKey || !allowlistInput.trim()} // Button disabled if no allowlist input
                className="w-full bg-gp-mid-violet text-white font-semibold py-3 px-6 rounded-lg
                           hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gp-mid-violet focus:ring-offset-2 focus:ring-offset-gp-deep-blue-purple
                           transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-md hover:shadow-gp-glow-sm transform hover:scale-[1.02]"
              >
                {isLoading ? "Claiming..." : "Claim POPPass"}
              </button>
            </div>
          ) : (
            // Show Solana Accelerate Pass Image if pass HAS been claimed
            <div className="my-6 flex flex-col items-center">
              <Image
                src="/solana-accelerate-pass.png" // Ensure this path is correct (from /public)
                alt="Solana Accelerate Pass"
                width={400} // Adjust as needed
                height={200} // Adjust based on image aspect ratio
                className="rounded-lg shadow-lg object-contain" // Added object-contain
              />
            </div>
          )}
        </>
      )}

      {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}

      {/* Success message - always shown if transactionSignature exists (pass is claimed) */}
      {transactionSignature && successMessage && (
        <div className="mt-6 p-4 bg-gp-card-bg/90 border border-gp-border rounded-md text-center space-y-2 backdrop-blur-sm">
          <p className="text-lg font-medium text-gp-bright-green">{successMessage}</p>
          <p className="text-xs sm:text-sm text-gp-text-light break-all">
            Transaction:{" "}
            <a
              href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=${process.env.NEXT_PUBLIC_HELIUS_RPC_URL?.includes("devnet") ? "devnet" : "mainnet-beta"}`}
              target="_blank" rel="noopener noreferrer" className="underline hover:text-gp-bright-green"
            >
              View on Explorer
            </a>
          </p>
        </div>
      )}

      <div className="text-center mt-6">
        <a href="/" className="text-gp-text-secondary hover:text-gp-bright-green transition-colors duration-300 text-sm">
          ← Go to Home
        </a>
      </div>
    </div>
  );
};

export default ClaimForm;