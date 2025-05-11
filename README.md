# Zklaim ([Live Demo](https://zklaim-sparsh0006s-projects.vercel.app))

Zklaim is a Proof of Participation Pass (POPPass) system built on the Solana blockchain, designed to revolutionize event credentialing. It leverages **Light Protocol's innovative zk-compression technology** to issue POPPasses as highly efficient, scalable, and ultra-low-cost zk-Compressed NFTs. This approach significantly reduces transaction fees and on-chain storage requirements compared to traditional NFTs, making it ideal for events of any size.

## Features

-   **zk-Compressed POPPasses:** Utilizes Light Protocol to mint POPPasses as zk-Compressed NFTs, ensuring massive scalability and minimal transaction costs on Solana.
-   **Efficient Event Management:** Allows organizers to create events, define descriptions, and manage attendee allowlists.
-   **Secure & Verifiable Claims:** Implements Merkle tree-based allowlists for secure verification of attendee eligibility before claiming a POPPass.
-   **Seamless User Experience:**
    -   A Next.js frontend for intuitive event creation and pass claiming.
    -   QR code generation for easy sharing and access to event claim links.
-   **Solana Wallet Integration:** Supports popular Solana wallets (e.g., Phantom) via the Solana Wallet Adapter.
-   **AI-Powered Event Assistant:** An integrated AI chatbot to provide information on Solana, crypto events, and related topics.
-   **Persistent Data Storage:** Uses MongoDB for reliable storage of event and claim information.

## Installation

The Zklaim project consists of a backend and a frontend application.

1.  **Clone the main Zklaim repository:**
    ```bash
    git clone https://github.com/sparsh0006/zklaim.git
    ```

2.  **Backend Setup (`poppass-backend`):**
    *   Navigate to the backend directory:
        ```bash
        cd zklaim/poppass-backend
        ```
    *   Install backend dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `poppass-backend` root and populate it with your environment variables. Example:
        ```env
        # Backend .env configuration
        PORT=5001
        MONGO_URI="your_mongodb_connection_string"
        HELIUS_RPC_URL="your_helius_rpc_url_for_devnet_or_mainnet"
        # Example: BACKEND_WALLET_SECRET_KEY="[1,2,3,...,64]" (must be a valid 64-byte array)
        BACKEND_WALLET_SECRET_KEY="[your,64,numbers,representing,your,wallet,secret,key,bytes]"
        OPENAI_API_KEY="your_openai_api_key"
        SERP_API_KEY="your_serpapi_key"
        FRONTEND_URL="http://localhost:3000" # Or your deployed frontend URL
        NODE_ENV="development"
        ```
        **Note on `BACKEND_WALLET_SECRET_KEY`:** This must be a JSON-parsable array of 64 numbers representing the byte array of your backend wallet's secret key. You can usually export this from wallets like Phantom (as a byte array) and then format it.

3.  **Frontend Setup (`poppass-frontend`):**
    *   Navigate to the frontend directory:
        ```bash
        cd ../poppass-frontend # Assuming you are in zklaim/poppass-backend
        # Or from the root: cd zklaim/poppass-frontend
        ```
    *   Install frontend dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env.local` file in the `poppass-frontend` root and populate it. Example:
        ```env
        # Frontend .env.local configuration
        NEXT_PUBLIC_BACKEND_URL="http://localhost:5001" # URL of your running backend
        NEXT_PUBLIC_HELIUS_RPC_URL="your_helius_rpc_url_for_devnet_or_mainnet" # Same network as backend
        ```
        **Note:** Ensure `NEXT_PUBLIC_HELIUS_RPC_URL` points to the same Solana network (e.g., Devnet, Mainnet Beta) that your backend is configured to use.

## Usage

To run the Zklaim system, you need to start both the backend and frontend services.

1.  **Start the Backend Service:**
    *   In the `poppass-backend` directory, run:
        ```bash
        npm run dev
        ```
    *   The backend will typically be accessible at `http://localhost:5001` (or your configured port).

2.  **Start the Frontend Application:**
    *   In the `poppass-frontend` directory, run:
        ```bash
        npm run dev
        ```
    *   The frontend will typically be accessible at `http://localhost:3000`.

Open your browser and navigate to the frontend URL (e.g., `http://localhost:3000`) to use Zklaim.

## Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3.  Commit your changes:
    ```bash
    git commit -m "Add feature-name"
    ```
4.  Push to the branch:
    ```bash
    git push origin feature-name
    ```
5.  Open a pull request.

## License

This project is licensed under the [ISC License](LICENSE).

## Contact

For questions or feedback, please open an issue in the GitHub repository: [https://github.com/sparsh0006/zklaim/issues](https://github.com/sparsh0006/zklaim/issues)