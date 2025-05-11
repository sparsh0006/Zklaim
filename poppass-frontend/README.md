# Zklaim POPPass Frontend

This is the frontend for the Zklaim POPPass System, a Next.js application designed for creating events and allowing attendees to claim their Proof of Presence Passes (POPPasses) on the Solana blockchain. It features a modern, responsive UI with Solana wallet integration and an AI-powered assistant.

## Key Features

*   **Event Creation:** Intuitive interface for organizers to create new events, define details, and manage allowlists.
*   **POPPass Claiming:** Seamless process for attendees to claim their unique POPPass for an event, typically initiated via a QR code.
*   **Solana Wallet Integration:** Supports Solana wallets (e.g., Phantom) using the Solana Wallet Adapter for secure on-chain interactions.
*   **QR Code Generation:** Displays QR codes for easy sharing of event claim links.
*   **AI Assistant:** An integrated AI chat assistant to answer queries related to Solana, crypto events, and more.
*   **Responsive Design:** Built with Tailwind CSS for a consistent experience across devices.
*   **Modern Tooling:** Leverages Next.js App Router, TypeScript, and Geist font.

## Tech Stack

*   **Framework:** Next.js (v14.x)
*   **Language:** TypeScript
*   **UI Library:** React (v18)
*   **Styling:** Tailwind CSS
*   **Solana Integration:**
    *   `@solana/web3.js`
    *   `@solana/wallet-adapter-react`
    *   `@solana/wallet-adapter-react-ui`
    *   `@solana/wallet-adapter-phantom`
*   **Utilities:**
    *   `merkletreejs` (for client-side operations related to Merkle proofs, if any)
    *   `qrcode.react` (for displaying QR codes)
*   **State Management:** React Context (for Wallet Provider)

## Prerequisites

*   Node.js (v18.x or higher recommended)
*   npm, yarn, pnpm, or bun

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd poppass-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

## Environment Variables

Create a `.env.local` file in the root of the `poppass-frontend` directory and add the following environment variables:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001 # URL of your poppass-backend instance
NEXT_PUBLIC_HELIUS_RPC_URL=your_helius_rpc_url # Your Helius RPC URL (e.g., for Devnet or Mainnet)