import WalletConnectButton from "../../components/WalletConnectButton";
import EventForm from "../../components/EventForm";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen flex flex-col items-center"> {/* Inherits gradient */}
      <header className="w-full px-4 sm:px-8 py-5 flex justify-between items-center border-b border-gp-border"> {/* GP border */}
        <a href="/" className="text-3xl sm:text-4xl font-bold text-white hover:text-gp-bright-green transition-colors duration-300">
          Zklaim
        </a>
        <WalletConnectButton />
      </header>
      <div className="w-full max-w-2xl px-4 pt-10 sm:pt-16 pb-8 flex-grow flex flex-col justify-center">
        <EventForm />
      </div>
    </div>
  );
}