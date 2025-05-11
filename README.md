# POPPass Backend

A backend service for creating, managing, and distributing Proof of Presence Passes (POPPasses) as compressed NFTs on the Solana blockchain. This project leverages the **Light Protocol SDK** for efficient and low-cost token operations. It also includes an AI-powered assistant for event-related queries.

## Key Features

*   **Event Management:** Create events with detailed descriptions and creator information.
*   **Allowlist & Merkle Trees:** Securely manage event attendance eligibility using allowlists and Merkle proofs.
*   **Compressed NFT POPPasses (via Light Protocol):**
    *   Creates unique, event-specific compressed token mints.
    *   Assigns POPPasses to attendees as compressed tokens, minimizing on-chain costs.
*   **Secure Claiming:** Enables verified attendees to claim their POPPasses.
*   **AI Assistant:** Provides information on Solana and crypto events using OpenAI and SerpAPI for real-time web searches.
*   **Persistent Storage:** Uses MongoDB to store event and claim data.

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB (with Mongoose ODM)
*   **Solana Integration:**
    *   `@solana/web3.js`: General Solana blockchain interaction.
    *   `@lightprotocol/compressed-token`: Core SDK for creating and minting compressed tokens (POPPasses).
    *   `@lightprotocol/stateless.js`: Utilities for interacting with Light Protocol, including RPC connections.
*   **AI:** OpenAI API, Axios (for SerpAPI)
*   **Utilities:** `merkletreejs` for allowlist verification, `dotenv` for environment management.

## Prerequisites

*   Node.js (v18.x or higher recommended)
*   npm or yarn
*   MongoDB instance (local or cloud-hosted like MongoDB Atlas)
*   Helius RPC URL (for Solana interaction)
*   OpenAI API Key
*   SerpAPI Key

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd poppass-backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

## Environment Variables

Create a `.env` file in the root of the `poppass-backend` directory and populate it with the following variables. Refer to `src/config/env.ts` for all required and optional variables.

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
HELIUS_RPC_URL=your_helius_rpc_url
BACKEND_WALLET_SECRET_KEY="[your,64,byte,secret,key,as,array,of,numbers]" # e.g., from Phantom export
OPENAI_API_KEY=your_openai_api_key
SERP_API_KEY=your_serpapi_key
FRONTEND_URL=http://localhost:3000 # Base URL for frontend to construct claim links