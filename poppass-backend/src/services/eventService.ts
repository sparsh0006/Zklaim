import EventModel, { IEvent } from '../models/Event';
import { generateMerkleTree } from '../utils/merkletree';
import { createEventMint } from './solanaService';

export const createEvent = async (
  name: string,
  description: string,
  creatorAddress: string,
  allowlist: string[]
): Promise<IEvent> => {
  const { root: merkleRoot } = generateMerkleTree(allowlist);
  const { mint: mintPublicKey } = await createEventMint();
  const mintAddress = mintPublicKey.toBase58();

  const claimLinkBase = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/claim/`; // Or your preferred base URL

  const newEvent = new EventModel({
    name,
    description,
    creatorAddress,
    mintAddress,
    allowlist,
    merkleRoot,
    claimLinkBase,
  });

  await newEvent.save();
  console.log(`Event "${name}" created with mint ${mintAddress} and Merkle root ${merkleRoot}`);
  return newEvent;
};

export const getPublicEventDetails = async (
  eventId: string
): Promise<{ name: string; description: string } | null> => {
  const event = await EventModel.findById(eventId).select('name description').lean();
  if (!event) {
    return null;
  }
  return { name: event.name, description: event.description };
};