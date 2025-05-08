import WalletConnectButton from "../../components/WalletConnectButton"; // Updated import path
import EventForm from "../../components/EventForm"; // Updated import path
import Link from 'next/link';

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-4 border-b">
        <Link href="/" className="text-3xl font-bold text-gray-800 hover:text-purple-600 mb-4 sm:mb-0">
          Zklaim
        </Link>
        <WalletConnectButton />
      </header>
      <div className="max-w-2xl mx-auto">
        <EventForm />
      </div>
    </div>
  );
}