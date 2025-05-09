"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import QrCodeDisplay from "./QrCodeDisplay";

const EventForm = () => {
  const { publicKey } = useWallet();
  // ... (state variables remain the same)
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [allowlistStr, setAllowlistStr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventResult, setEventResult] = useState<{ eventId: string; mintAddress: string; merkleRoot: string; claimUrl: string; } | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    // ... (handleSubmit logic remains the same)
    e.preventDefault();
    if (!publicKey) { setError("Please connect your wallet."); return; }
    if (!eventName.trim() || !description.trim() || !allowlistStr.trim()) { setError("All fields are required."); return; }
    setIsLoading(true); setError(null);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) throw new Error("Backend URL is not configured!");
      const apiUrl = `${backendUrl}/api/events`;
      const response = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: eventName, description, creatorAddress: publicKey.toBase58(), allowlist: allowlistStr.split(/[\n,]+/).map((addr) => addr.trim()).filter(addr => addr.length > 0), }), });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create event");
      const claimUrl = `${typeof window !== "undefined" ? window.location.origin : ''}/claim/${data.eventId}`;
      setEventResult({ ...data, claimUrl });
    } catch (err: any) { setError(err.message || "An unknown error occurred."); setEventResult(null); }
    finally { setIsLoading(false); }
  };

  // Theme-specific classes for inputs and labels
  const inputBaseClasses = "w-full bg-gp-input-bg border border-gp-border text-gp-text-light placeholder-gp-text-secondary rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gp-bright-green focus:border-transparent transition-colors duration-300 shadow-sm backdrop-blur-sm";
  const labelBaseClasses = "block text-sm font-medium text-gp-bright-green mb-1.5"; // Accent labels

  if (eventResult) {
    return (
      <div className="bg-gp-card-bg shadow-xl rounded-2xl p-6 sm:p-8 space-y-4 border border-gp-border backdrop-blur-md text-center">
        <h3 className="text-2xl font-semibold text-gp-bright-green">Event Created Successfully!</h3>
        <div className="space-y-1 text-left pt-4 text-sm">
            <p className="text-gp-text-light break-all"><strong>Event ID:</strong> {eventResult.eventId}</p>
            <p className="text-gp-text-light break-all"><strong>Mint Address:</strong> {eventResult.mintAddress}</p>
            <p className="text-gp-text-light break-all"><strong>Merkle Root:</strong> {eventResult.merkleRoot}</p>
        </div>
        <div className="mt-6">
          <p className="font-semibold text-gp-bright-green mb-3">Share this QR Code:</p>
          <div className="inline-block p-0 bg-white rounded-md shadow-lg">
              <QrCodeDisplay eventId={eventResult.eventId} claimUrl={eventResult.claimUrl} />
          </div>
          <p className="mt-3 text-xs text-gp-text-secondary break-all">
            Or share link: <a href={eventResult.claimUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gp-bright-green underline">{eventResult.claimUrl}</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gp-card-bg shadow-xl rounded-2xl p-6 sm:p-10 space-y-6 border border-gp-border backdrop-blur-md">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        Create New Event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="eventName" className={labelBaseClasses}>Event Name:</label>
          <input
            type="text" id="eventName" className={inputBaseClasses} value={eventName} onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., Solana Dev Day" required
          />
        </div>
        <div>
          <label htmlFor="description" className={labelBaseClasses}>Description:</label>
          <textarea
            id="description" className={`${inputBaseClasses} min-h-[100px]`} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of your event..." rows={3} required
          />
        </div>
        <div>
          <label htmlFor="allowlist" className={labelBaseClasses}>Allowlist (Solana addresses):</label>
          <textarea
            id="allowlist" className={`${inputBaseClasses} min-h-[120px]`} value={allowlistStr} onChange={(e) => setAllowlistStr(e.target.value)}
            rows={5} placeholder="Address1, Address2, Address3..." required
          />
        </div>
        <button
          type="submit" disabled={isLoading || !publicKey}
          className="w-full bg-gp-mid-violet text-white font-semibold py-3 px-6 rounded-lg
                     hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gp-mid-violet focus:ring-offset-2 focus:ring-offset-gp-deep-blue-purple
                     transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-md hover:shadow-gp-glow-sm transform hover:scale-[1.02]"
        >
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>} {/* Kept red for error emphasis */}
    </div>
  );
};
export default EventForm;