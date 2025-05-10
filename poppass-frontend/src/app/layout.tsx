import type { Metadata } from "next";
import "./globals.css"; // Tailwind base, components, utilities
import WalletContextProvider from "../contexts/WalletContextProvider"; // Your Wallet Adapter Provider
import AIAssistant from "../components/AIAssistant"; // Import the AI Assistant

export const metadata: Metadata = {
  title: "Zklaim POPPass System",
  description: "Create events and claim your Proof of Presence passes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full"> {/* Ensure html takes full height */}
      <body
        className="h-full m-0 p-0 antialiased 
                   bg-gp-gradient text-gp-text-light 
                   selection:bg-gp-mid-violet selection:text-white"
      > {/* Global theme styles applied here */}
        <WalletContextProvider>
          {/* Main content wrapper */}
          <div className="min-h-full flex flex-col"> {/* Ensures children can grow to fill height */}
            {children} {/* Your page content will be rendered here */}
          </div>

          {/* AI Assistant - Placed here to be on top of all page content but within context providers if needed */}
          <AIAssistant />
        </WalletContextProvider>
      </body>
    </html>
  );
}