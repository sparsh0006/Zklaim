import Link from "next/link";

export default function HomePage() {
  return (
    // Inherits gradient from layout.tsx
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-xl">
          Welcome to Zklaim <br className="sm:hidden"/>
          <span className="text-gp-bright-green">POP</span>
          <span className="text-white">Pass</span> System
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-gp-text-secondary max-w-2xl drop-shadow-lg">
          Create events and let attendees claim their unique Proof of Presence passes.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch justify-around max-w-4xl mt-12 sm:w-full gap-6 sm:gap-10">
          {/* Create Event Card - Enhanced Hover Effects */}
          <Link
            href="/create-event"
            className="flex flex-col p-8 text-left border border-gp-border w-full sm:w-[45%] rounded-2xl
                       bg-gp-card-bg hover:bg-gp-card-bg-hover backdrop-blur-md
                       shadow-xl group
                       transition-all duration-300 ease-in-out
                       hover:shadow-gp-glow-md // Use gp-glow-md for more pronounced effect
                       hover:scale-[1.03]
                       hover:border-gp-bright-green/50" // Accent border on hover
          >
            <h3 className="text-2xl font-bold text-gp-bright-green group-hover:text-white transition-colors duration-300">
              Create Event →
            </h3>
            <p className="mt-4 text-md text-gp-text-secondary flex-grow group-hover:text-gp-text-light transition-colors duration-300">
              Organizers can set up new events and generate QR codes for
              attendees.
            </p>
          </Link>

          {/* Claim Pass Card (Informational) */}
          <div
            className="flex flex-col p-8 text-left border border-gp-border w-full sm:w-[45%] rounded-2xl
                       bg-gp-card-bg backdrop-blur-md shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white">
              Claim Pass
            </h3>
            <p className="mt-4 text-md text-gp-text-secondary flex-grow">
              Attendees can scan a QR code at an event to claim their POPPass.
            </p>
          </div>
        </div>
        {/* <p className="mt-16 text-gp-text-secondary text-sm drop-shadow-lg">
            Ensure your backend server is running to use the system.
        </p> */}
      </main>
    </div>
  );
}