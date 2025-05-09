import type { Metadata } from "next";
import "./globals.css";
import WalletContextProvider from "../contexts/WalletContextProvider";

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
    <html lang="en" className="h-full">
      <body className="h-full m-0 p-0 antialiased bg-gp-gradient text-gp-text-light selection:bg-gp-mid-violet selection:text-white"> {/* Applied global GP theme */}
        <WalletContextProvider>
          <div className="min-h-full flex flex-col">
            {children}
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}