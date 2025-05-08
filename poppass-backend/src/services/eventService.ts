import EventModel, { IEvent } from '../models/Event';
import { generateMerkleTree } from '../utils/merkletree';
import { createEventMint } from './solanaService';

export const createEvent = async (
  name: string,
  description: string,
  creatorAddress: string, // Should be validated Solana address
  allowlist: string[]
): Promise<IEvent> => {
  // 1. Generate Merkle Tree
  const { root: merkleRoot } = generateMerkleTree(allowlist);

  // 2. Create the Compressed Token Mint on Solana for this event
  const { mint: mintPublicKey } = await createEventMint();
  const mintAddress = mintPublicKey.toBase58();

  // 3. Create Event Document
  // TODO: Generate a unique claim link base or use event ID
  const claimLinkBase = `http://localhost:${process.env.PORT || 5001}/api/claim/`; // Example

  const newEvent = new EventModel({
    name,
    description,
    creatorAddress,
    mintAddress,
    allowlist, // Store the original list
    merkleRoot,
    claimLinkBase,
  });

  // 4. Save to DB
  await newEvent.save();
  console.log(`Event "${name}" created with mint ${mintAddress} and Merkle root ${merkleRoot}`);

  return newEvent;
};