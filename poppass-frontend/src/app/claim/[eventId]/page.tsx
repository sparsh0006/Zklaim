"use client";

import { useParams } from "next/navigation";
import WalletConnectButton from "../../../components/WalletConnectButton"; // Updated import path
import ClaimForm from "../../../components/ClaimForm"; // Updated import path
import Link from "next/link";

export default function ClaimPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  return (
    <div className="container mx-auto px-4 py-8">
       <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-4 border-b">
        <Link href="/" className="text-3xl font-bold text-gray-800 hover:text-purple-600 mb-4 sm:mb-0">
          Zklaim
        </Link>
        <WalletConnectButton />
      </header>
      <div className="max-w-lg mx-auto">
        {eventId ? (
          <ClaimForm eventId={eventId} />
        ) : (
          <p className="text-center text-gray-500">Loading event details or event ID not found...</p>
        )}
      </div>
      <div className="text-center mt-8">
        <Link href="/" className="text-purple-600 hover:text-purple-800">
          ← Go to Home
        </Link>
      </div>
    </div>
  );
}