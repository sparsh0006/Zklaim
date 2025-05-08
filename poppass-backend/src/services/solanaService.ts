import { Connection, Keypair, PublicKey, Signer, TransactionSignature } from '@solana/web3.js';
import { Rpc, createRpc, confirmTx as confirmLightTx } from '@lightprotocol/stateless.js';
import { createMint, mintTo } from '@lightprotocol/compressed-token';
import { config } from '../config/env';
import { Buffer } from 'buffer'; // Ensure Buffer is imported

let connection: Rpc | null = null;
let backendWallet: Keypair | null = null;

export const getSolanaConnection = (): Rpc => {
  if (!connection) {
    // Ensure createRpc is called correctly based on its definition
    // If it takes separate URLs: createRpc(config.heliusRpcUrl, config.heliusRpcUrl, config.heliusRpcUrl);
    // If it takes one URL:
    connection = createRpc(config.heliusRpcUrl);
  }
  return connection;
};

export const getBackendWallet = (): Keypair => {
  if (!backendWallet) {
    const secretKeyBytes = Uint8Array.from(config.backendWalletSecretKey);
    backendWallet = Keypair.fromSecretKey(secretKeyBytes);
    console.log(`Backend Wallet Loaded: ${backendWallet.publicKey.toBase58()}`);
  }
  return backendWallet;
};

// Creates a new compressed token mint specifically for an event POPPass
// Decimals = 0, Amount = 1 (representing one unique pass)
export const createEventMint = async (): Promise<{ mint: PublicKey; transactionSignature: string }> => {
  const conn = getSolanaConnection();
  const wallet = getBackendWallet();

  console.log(`Creating event mint with authority: ${wallet.publicKey.toBase58()}`);

  try {
    const { mint, transactionSignature } = await createMint(
      conn,
      wallet, // Payer
      wallet.publicKey, // Mint authority
      0, // Decimals (0 for NFTs/unique passes)
      Keypair.generate(), // Mint keypair
      undefined, // Confirm options
      undefined, // Token program (defaults to SPL Token)
      undefined  // Freeze authority (optional)
    );
    console.log(`Event Mint Created: ${mint.toBase58()}, Tx: ${transactionSignature}`);
    return { mint, transactionSignature };
  } catch (error) {
    console.error("Error creating event mint:", error);
    throw error; // Re-throw for controller handling
  }
};

// Mints/assigns a single POPPass token to the attendee
export const assignToken = async (eventMintAddress: PublicKey, recipientAddress: PublicKey): Promise<TransactionSignature> => {
  const conn = getSolanaConnection();
  const wallet = getBackendWallet(); // Backend pays fees and is mint authority

  console.log(`Assigning token for mint ${eventMintAddress.toBase58()} to ${recipientAddress.toBase58()}`);

  try {
    const txSignature = await mintTo(
      conn,
      wallet, // Payer
      eventMintAddress,
      recipientAddress, // Destination owner
      wallet, // Mint authority
      1, // Amount (mint exactly 1 pass)
      undefined, // optional state tree info
      undefined // optional token pool info
    );
    console.log(`Token assigned to ${recipientAddress.toBase58()}, Tx: ${txSignature}`);
    return txSignature;
  } catch (error) {
    console.error("Error assigning token:", error);
    throw error; // Re-throw for controller handling
  }
};