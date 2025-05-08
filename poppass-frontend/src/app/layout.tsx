import type { Metadata } from "next";
import "./globals.css";
import WalletContextProvider from "../contexts/WalletContextProvider"; // Updated import path

export const metadata: Metadata = {
  title: "POPPass Frontend",
  description: "Claim your POPPass",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <WalletContextProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow container mx-auto p-4">
             {children}
            </main>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}