"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import QrCodeDisplay from "./QrCodeDisplay"; // Correct: QrCodeDisplay is in the same components/ folder

const EventForm = () => {
  const { publicKey } = useWallet();
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [allowlistStr, setAllowlistStr] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventResult, setEventResult] = useState<{
    eventId: string;
    mintAddress: string;
    merkleRoot: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      setError("Please connect your wallet.");
      return;
    }
    if (!eventName.trim() || !description.trim()) {
      setError("Event Name and Description are required.");
      return;
    }

    const allowlist = allowlistStr
      .split(/[\n,]+/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0);

    if (allowlist.length === 0) {
      setError("Allowlist cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEventResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: eventName,
            description,
            creatorAddress: publicKey.toBase58(),
            allowlist,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      setEventResult(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventName">
            Event Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allowlist">
            Allowlist (Solana addresses, one per line or comma-separated):
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="allowlist"
            value={allowlistStr}
            onChange={(e) => setAllowlistStr(e.target.value)}
            rows={5}
            placeholder="Address1, Address2, Address3..."
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            type="submit"
            disabled={isLoading || !publicKey}
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}

      {eventResult && (
        <div className="mt-6 p-4 border border-green-300 bg-green-50 rounded">
          <h3 className="text-xl font-semibold text-green-700">Event Created Successfully!</h3>
          <p className="text-sm text-gray-600 mt-2"><strong>Event ID:</strong> {eventResult.eventId}</p>
          <p className="text-sm text-gray-600"><strong>Mint Address:</strong> {eventResult.mintAddress}</p>
          <p className="text-sm text-gray-600"><strong>Merkle Root:</strong> {eventResult.merkleRoot}</p>
          <div className="mt-4">
            <p className="font-semibold text-gray-700">Share this QR Code with attendees:</p>
            <div className="mt-2 flex justify-center">
                <QrCodeDisplay eventId={eventResult.eventId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventForm;