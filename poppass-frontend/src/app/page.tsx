import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Welcome to Zklaim <span className="text-purple-600">POPPass</span> System
        </h1>

        <p className="mt-3 text-lg sm:text-xl text-gray-600">
          Create events and let attendees claim their unique Proof of Presence passes.
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-10 sm:w-full gap-4">
          <Link
            href="/create-event"
            className="p-6 mt-6 text-left border w-full sm:w-96 rounded-xl hover:text-purple-600 hover:border-purple-600 focus:text-purple-600 focus:border-purple-600 transition-colors duration-150 ease-in-out"
          >
            <h3 className="text-2xl font-bold">Create Event →</h3>
            <p className="mt-4 text-xl">
              Organizers can set up new events and generate QR codes for attendees.
            </p>
          </Link>

          <div className="p-6 mt-6 text-left border w-full sm:w-96 rounded-xl text-gray-700">
            <h3 className="text-2xl font-bold">Claim Pass</h3>
            <p className="mt-4 text-xl">
              Attendees can scan a QR code at an event to claim their POPPass.
            </p>
          </div>
        </div>
        <p className="mt-12 text-gray-500 text-sm">
            Ensure your backend server is running to use the system.
        </p>
      </main>
    </div>
  );
}