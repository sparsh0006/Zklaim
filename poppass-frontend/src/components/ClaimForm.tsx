"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { getMerkleProof } from "../lib/merkletree";

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
        setError("Please provide the event's original allowlist to generate your proof.");
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
  };

  // Consistent theme classes for inputs and labels
  const inputBaseClasses = "w-full bg-gp-input-bg border border-gp-border text-gp-text-light placeholder-gp-text-secondary rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gp-bright-green focus:border-transparent transition-colors duration-300 shadow-sm backdrop-blur-sm";
  const labelBaseClasses = "block text-sm font-medium text-gp-bright-green mb-1.5"; // Using bright green for label accent

  return (
    // Main card for the form, using Greenish-Purple Solana theme's frosted glass effect
    <div className="bg-gp-card-bg shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gp-border backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-1 text-center text-white">
        Claim POPPass for Event:
      </h2>
      {/* Event ID display, styled for readability and truncation */}
      <p
        className="font-mono text-gp-bright-green text-center text-lg block overflow-hidden text-ellipsis whitespace-nowrap max-w-[220px] sm:max-w-xs md:max-w-sm mx-auto mb-6"
        title={eventId} // Shows full ID on hover
      >
        {eventId}
      </p>

      {/* Conditional rendering based on wallet connection */}
      {!connected && (
        // Using a theme-consistent color for the warning, can be gp-text-secondary or gp-mid-violet
        <p className="text-center text-gp-mid-violet py-4 font-semibold">Please connect your wallet to proceed.</p>
      )}

      {connected && publicKey && (
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
            />
          </div>
          <button
            onClick={handleClaim}
            disabled={isLoading || !publicKey || !allowlistInput.trim()}
            className="w-full bg-gp-mid-violet text-white font-semibold py-3 px-6 rounded-lg
                       hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gp-mid-violet focus:ring-offset-2 focus:ring-offset-gp-deep-blue-purple
                       transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-md hover:shadow-gp-glow-sm transform hover:scale-[1.02]"
          >
            {isLoading ? "Claiming..." : "Claim POPPass"}
          </button>
        </div>
      )}

      {/* Error message display */}
      {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>} {/* Red for errors is standard UX */}

      {/* Success message display */}
      {successMessage && (
        <div className="mt-6 p-4 bg-gp-card-bg/90 border border-gp-border rounded-md text-center space-y-2 backdrop-blur-sm"> {/* Slightly more opaque success card */}
          <p className="text-lg font-medium text-gp-bright-green">{successMessage}</p>
          {transactionSignature && (
            <p className="text-xs sm:text-sm text-gp-text-light break-all">
              Transaction:{" "}
              <a
                // Simplified cluster detection for the explorer link
                href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=${process.env.NEXT_PUBLIC_HELIUS_RPC_URL?.includes("devnet") ? "devnet" : "mainnet-beta"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gp-bright-green"
              >
                View on Explorer
              </a>
            </p>
          )}
        </div>
      )}

      {/* Navigation link back to home */}
      <div className="text-center mt-6">
        <a href="/" className="text-gp-text-secondary hover:text-gp-bright-green transition-colors duration-300 text-sm">
          ← Go to Home
        </a>
      </div>
    </div>
  );
};

export default ClaimForm;