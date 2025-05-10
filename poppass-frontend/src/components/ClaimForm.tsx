"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState, useEffect } from "react";
import Image from 'next/image';

interface EventDetails {
  name: string;
  description: string;
}

interface ClaimFormProps {
  eventId: string;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ eventId }) => {
  const { publicKey, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // For claim errors
  const [eventDetailsError, setEventDetailsError] = useState<string | null>(null); // Separate error for details fetching
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);

  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isLoadingEventDetails, setIsLoadingEventDetails] = useState<boolean>(true);

  // Effect to clear claim-specific errors when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setError(null); // Clear claim errors if wallet disconnects
      // Optionally, you might want to reset success messages too if they shouldn't persist
      // setSuccessMessage(null);
      // setTransactionSignature(null);
    }
  }, [connected]);


  useEffect(() => {
    if (eventId) {
      const fetchDetails = async () => {
        setIsLoadingEventDetails(true);
        setEventDetailsError(null); // Clear previous event details errors
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          if (!backendUrl) throw new Error("Backend URL is not configured!");
          const response = await fetch(`${backendUrl}/api/events/${eventId}/public-details`);
          if (!response.ok) {
            if (response.status === 404) throw new Error("Event not found.");
            const errorData = await response.json().catch(() => ({ message: "Failed to fetch event details." }));
            throw new Error(errorData.message || "Failed to fetch event details.");
          }
          const data: EventDetails = await response.json();
          setEventDetails(data);
        } catch (err: any) {
          setEventDetailsError(err.message); // Use separate error state for event details
          console.error("Failed to load event details:", err);
        } finally {
          setIsLoadingEventDetails(false);
        }
      };
      fetchDetails();
    }
  }, [eventId]);

  const handleClaim = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet to claim."); // This error is for the action itself
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous claim errors before a new attempt
    // Only clear success if we are truly making a new attempt and don't have a signature
    if (!transactionSignature) {
        setSuccessMessage(null);
    }


    if (!transactionSignature) {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            if (!backendUrl) throw new Error("Backend URL is not configured!");
            const apiUrl = `${backendUrl}/api/claim/${eventId}`;
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ attendeeAddress: publicKey.toBase58() }),
            });
            const data = await response.json();
            if (!response.ok) {
                // Specific handling for "Attendee address not found in event allowlist"
                // to ensure it's set as the primary error message.
                if (data.message && data.message.includes("not found in event allowlist")) {
                    setError(data.message);
                } else {
                    throw new Error(data.message || "Failed to claim token.");
                }
                // Do not proceed to set success message if not ok
                return; // Explicitly return after setting error
            }
            setSuccessMessage(data.message || "POPPass Claimed Successfully!");
            if (data.transactionSignature) setTransactionSignature(data.transactionSignature);
        } catch (err: any) {
          setError(err.message || "An unknown error occurred while trying to claim.");
        } finally {
          setIsLoading(false);
        }
    } else {
        setIsLoading(false);
    }
  };

  // ----- JSX Part -----

  // Prioritize loading event details
  if (isLoadingEventDetails) {
    return (
      <div className="bg-gp-card-bg shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gp-border backdrop-blur-md text-center py-10">
        <p className="text-gp-text-secondary animate-pulse">Loading Event Details...</p>
      </div>
    );
  }

  // If event details failed to load, show that error prominently
  if (eventDetailsError && !eventDetails) {
    return (
      <div className="bg-gp-card-bg shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gp-border backdrop-blur-md text-center py-10">
        <p className="text-red-400">Error: {eventDetailsError}</p>
        <div className="text-center mt-6">
            <a href="/" className="text-gp-text-secondary hover:text-gp-bright-green transition-colors duration-300 text-sm">
            ← Go to Home
            </a>
        </div>
      </div>
    );
  }

  // If no event details and no error (shouldn't happen if eventId is present, but as a fallback)
  if (!eventDetails) {
    return (
        <div className="bg-gp-card-bg shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gp-border backdrop-blur-md text-center py-10">
            <p className="text-gp-text-secondary">Event information is unavailable.</p>
            <div className="text-center mt-6">
                <a href="/" className="text-gp-text-secondary hover:text-gp-bright-green transition-colors duration-300 text-sm">
                ← Go to Home
                </a>
            </div>
        </div>
    );
  }


  return (
    <div className="bg-gp-card-bg shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gp-border backdrop-blur-md">
      <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-center text-white">
        {transactionSignature ? "Solana Accelerate Pass" : eventDetails.name}
      </h2>

      {!transactionSignature && (
        <p className="font-mono text-gp-bright-green text-center text-sm block overflow-hidden text-ellipsis whitespace-nowrap max-w-[220px] sm:max-w-xs md:max-w-sm mx-auto mb-2" title={eventId}>
          Event ID: {eventId}
        </p>
      )}
      {!transactionSignature && eventDetails.description && (
        <p className="text-gp-text-secondary text-center text-sm mb-6 px-2 leading-relaxed">
          {eventDetails.description}
        </p>
      )}

      {/* Wallet Connection Prompt and Claim Section */}
      {!connected && (
        <p className="text-center text-gp-mid-violet py-4 font-semibold">Please connect your wallet to proceed.</p>
      )}

      {connected && publicKey && ( // Wallet is connected
        <>
          {!transactionSignature ? ( // Pass not yet claimed
            <div className="space-y-4 mt-2">
              {/* Claim button is always shown if wallet connected and not yet claimed */}
              <button
                onClick={handleClaim}
                disabled={isLoading || !publicKey}
                className="w-full bg-gp-mid-violet text-white font-semibold py-3 px-6 rounded-lg
                           hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gp-mid-violet focus:ring-offset-2 focus:ring-offset-gp-deep-blue-purple
                           transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-md hover:shadow-gp-glow-sm transform hover:scale-[1.02]"
              >
                {isLoading ? "Claiming..." : "Claim POPPass"}
              </button>
              {/* Display claim error only if not loading and wallet is connected */}
              {error && !isLoading && (
                <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
              )}
            </div>
          ) : (
            // Pass has been claimed
            <div className="my-6 flex flex-col items-center">
              <Image
                src="/solana-accelerate-pass.png"
                alt="Solana Accelerate Pass"
                width={400} height={200}
                className="rounded-lg shadow-lg object-contain"
              />
            </div>
          )}
        </>
      )}

      {/* Success message - Shown only if a transaction signature exists */}
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

      {/* General fallback error if event details loaded but something else is wrong and wallet not connected */}
      {error && !isLoadingEventDetails && !successMessage && !connected && eventDetails && (
         <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
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