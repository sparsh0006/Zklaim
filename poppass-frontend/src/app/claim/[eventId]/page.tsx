"use client";

import { useParams } from "next/navigation";
import WalletConnectButton from "../../../components/WalletConnectButton";
import ClaimForm from "../../../components/ClaimForm";

export default function ClaimPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  return (
    <div className="min-h-screen flex flex-col items-center"> {/* Inherits gradient */}
      <header className="w-full px-4 sm:px-8 py-5 flex justify-between items-center border-b border-gp-border">
        <a href="/" className="text-3xl sm:text-4xl font-bold text-white hover:text-gp-bright-green transition-colors duration-300">
          Zklaim
        </a>
        <WalletConnectButton />
      </header>
      <main className="w-full max-w-lg mx-auto px-4 pt-10 sm:pt-16 pb-8 flex-grow flex flex-col justify-center">
        {eventId ? (
          <ClaimForm eventId={eventId} />
        ) : (
          <p className="text-center text-gp-text-secondary">Loading event details or event ID not found...</p>
        )}
      </main>
    </div>
  );
}