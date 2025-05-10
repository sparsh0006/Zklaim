import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Background Layers (Image & Gradient Overlay) */}
      <Image
        src="/solana-accelerate-pass.png"
        alt="Solana Accelerate Themed Background"
        layout="fill"
        objectFit="cover"
        quality={70}
        className="absolute inset-0 z-0 opacity-15 md:opacity-100"
      />
      <div
        className="absolute inset-0 z-10
               bg-gradient-to-br from-gp-deep-blue-purple via-gp-mid-violet to-gp-bright-green
               opacity-80 sm:opacity-85"
      ></div>

      {/* Content Wrapper */}
      <div className="relative z-20 flex flex-col flex-grow w-full items-center px-4">
        {/* Heading and Subheading Section */}
        <div className="text-center pt-12 sm:pt-16 md:pt-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-xl">
            Welcome to Zklaim <br className="sm:hidden" />
            <span className="text-gp-bright-green">POP</span>
            <span className="text-white">Pass</span> System
          </h1>
          <p
            className="mt-3 sm:mt-4 text-lg text-gp-text-secondary mx-auto drop-shadow-lg px-2
                    max-w-none sm:max-w-2xl md:max-w-3xl"
          >
            Create events and let attendees claim their unique Proof-of-Participation passes.
          </p>
        </div>

        {/* Solana Logo - ADDED NEW SECTION */}
        <div className="flex flex-col items-center justify-center mt-16 mb-16">
          <p className="text-white text-2xl font-medium mb-6">Powered By</p>
          <Image
            src="/solana.png"
            alt="Solana Logo"
            width={500}
            height={500}
            className="w-auto h-auto"
          />
        </div>

        {/* Spacer to push cards down - reduced since logo is bigger now */}
        <div className="flex-grow min-h-[2vh] sm:min-h-[5vh] md:min-h-[05vh]"></div>

        {/* Cards Section */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center max-w-4xl w-full gap-6 sm:gap-10 pb-16 sm:pb-20 md:pb-24">
          {/* Create Event Card */}
          <Link
            href="/create-event"
            className="flex flex-col p-8 text-left border border-gp-border w-full sm:w-[45%] rounded-2xl
                   bg-gp-card-bg hover:bg-gp-card-bg-hover backdrop-blur-md
                   shadow-xl group
                   transition-all duration-300 ease-in-out
                   hover:shadow-gp-glow-md
                   hover:scale-[1.03]
                   hover:border-gp-bright-green/50"
          >
            <h3 className="text-2xl font-bold text-gp-bright-green group-hover:text-white transition-colors duration-300">
              Create Event →
            </h3>
            <p className="mt-4 text-md text-gp-text-secondary flex-grow group-hover:text-gp-text-light transition-colors duration-300">
              Organizers can set up new events and generate QR codes for attendees.
            </p>
          </Link>

          {/* Claim Pass Card (Informational) */}
          <div className="flex flex-col p-8 text-left border border-gp-border w-full sm:w-[45%] rounded-2xl bg-gp-card-bg backdrop-blur-md shadow-xl">
            <h3 className="text-2xl font-bold text-white">Claim Pass</h3>
            <p className="mt-4 text-md text-gp-text-secondary flex-grow">
              Attendees can scan a QR code at an event to claim their POPPass.
            </p>
          </div>
        </div>

        {/* Event Categories */}
        <div className="w-full max-w-6xl px-4 pb-24">
          {/* Upcoming Events */}
          <div className="mb-16 bg-gp-card-bg rounded-2xl border border-gp-border shadow-xl backdrop-blur-md overflow-hidden hover:shadow-gp-glow-md transition-all duration-300 ease-in-out hover:translate-y-[-8px]">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <Image
                  src="/upcoming-events.png"
                  alt="Upcoming Solana Events"
                  width={400}
                  height={300}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-2/3">
                <h2 className="text-3xl font-bold text-gp-bright-green mb-4">Upcoming Events</h2>
                <p className="text-gp-text-secondary mb-6">
                  Discover and join official Solana gatherings, conferences, and community meet-ups
                  happening around the globe. Stay connected with the latest in the ecosystem.
                </p>
                <Link
                  href="https://solana.com/events"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gp-bright-green hover:text-white transition-colors duration-300"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          {/* Hackathons */}
          <div className="mb-16 bg-gp-card-bg rounded-2xl border border-gp-border shadow-xl backdrop-blur-md overflow-hidden hover:shadow-gp-glow-md transition-all duration-300 ease-in-out hover:translate-y-[-8px]">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <Image
                  src="/hackathons.png"
                  alt="Solana Hackathons"
                  width={400}
                  height={300}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-2/3">
                <h2 className="text-3xl font-bold text-gp-bright-green mb-4">Hackathons</h2>
                <p className="text-gp-text-secondary mb-6">
                  Participate in challenging Solana hackathons. Build innovative projects, compete for
                  prizes, and connect with fellow developers and innovators in the Web3 space.
                </p>
                <Link
                  href="https://www.colosseum.org/breakout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gp-bright-green hover:text-white transition-colors duration-300"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          {/* Side Events */}
          <div className="mb-16 bg-gp-card-bg rounded-2xl border border-gp-border shadow-xl backdrop-blur-md overflow-hidden hover:shadow-gp-glow-md transition-all duration-300 ease-in-out hover:translate-y-[-8px]">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <Image
                  src="/side-events.png"
                  alt="Solana Side Events"
                  width={400}
                  height={300}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-2/3">
                <h2 className="text-3xl font-bold text-gp-bright-green mb-4">Side Events</h2>
                <p className="text-gp-text-secondary mb-6">
                  Explore satellite events, workshops, and social gatherings associated with major Solana
                  conferences. Network with community members and enhance your Solana experience.
                </p>
                <Link
                  href="https://earn.superteam.fun/hackathon/breakout/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gp-bright-green hover:text-white transition-colors duration-300"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          {/* Past Events */}
          <div className="mb-16 bg-gp-card-bg rounded-2xl border border-gp-border shadow-xl backdrop-blur-md overflow-hidden hover:shadow-gp-glow-md transition-all duration-300 ease-in-out hover:translate-y-[-8px]">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <Image
                  src="/past-events.webp"
                  alt="Past Solana Events"
                  width={400}
                  height={300}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-2/3">
                <h2 className="text-3xl font-bold text-gp-bright-green mb-4">Past Events</h2>
                <p className="text-gp-text-secondary mb-6">
                  Browse through previous Solana events, watch recordings, access presentations, and learn
                  from past gatherings. Catch up on what you missed in the ecosystem.
                </p>
                <Link
                  href="https://solana.com/events/archive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gp-bright-green hover:text-white transition-colors duration-300"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>

          {/* Bounties */}
          <div className="mb-8 bg-gp-card-bg rounded-2xl border border-gp-border shadow-xl backdrop-blur-md overflow-hidden hover:shadow-gp-glow-md transition-all duration-300 ease-in-out hover:translate-y-[-8px]">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <Image
                  src="/superteam.jpg"
                  alt="Solana Bounties"
                  width={400}
                  height={300}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-2/3">
                <h2 className="text-3xl font-bold text-gp-bright-green mb-4">Bounties</h2>
                <p className="text-gp-text-secondary mb-6">
                  Earn rewards by completing tasks and challenges set by Solana projects. Find opportunities
                  to contribute to the ecosystem while getting compensated for your skills and effort.
                </p>
                <Link
                  href="https://earn.superteam.fun/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gp-bright-green hover:text-white transition-colors duration-300"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}