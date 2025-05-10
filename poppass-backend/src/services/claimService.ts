import EventModel from '../models/Event';
import ClaimModel from '../models/Claim';
import { generateMerkleTree, getMerkleProof, verifyMerkleProof } from '../utils/merkletree';
import { assignToken } from './solanaService';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

export const claimToken = async (
  eventId: string,
  attendeeAddress: string
): Promise<{ success: boolean; message: string; txSignature?: string }> => {

  if (!eventId || !attendeeAddress) {
    return { success: false, message: 'Missing required claim information (eventId or attendeeAddress).' };
  }
  try {
      new PublicKey(attendeeAddress);
  } catch (e) {
       return { success: false, message: 'Invalid attendee wallet address format.' };
  }

  const event = await EventModel.findById(eventId);
  if (!event) {
    return { success: false, message: 'Event not found.' };
  }

  if (!event.allowlist || !event.allowlist.includes(attendeeAddress)) {
      return { success: false, message: 'Attendee address not found in event allowlist.' };
  }

  try {
    if (!event.merkleRoot) {
        console.error(`Event ${eventId} is missing a Merkle root.`);
        return { success: false, message: 'Event configuration error: Merkle root missing.' };
    }
    if (!event.allowlist || event.allowlist.length === 0) {
        console.warn(`Event ${eventId} has an empty or missing allowlist, but proceeding with Merkle root check if it exists.`);
    }

    const { leaves } = generateMerkleTree(event.allowlist);
    const proofForAttendee = getMerkleProof(leaves, attendeeAddress);

    if (!proofForAttendee) {
      return { success: false, message: 'Failed to generate internal Merkle proof. Address might not be in the effective tree structure.' };
    }

    const isProofValid = verifyMerkleProof(attendeeAddress, proofForAttendee, event.merkleRoot);
    if (!isProofValid) {
      console.error(`Internal Merkle proof verification failed for event ${eventId}, attendee ${attendeeAddress}.`);
      return { success: false, message: 'Internal Merkle proof validation failed.' };
    }
  } catch (merkleError: any) {
    console.error(`Error during internal Merkle proof generation/validation for event ${eventId}:`, merkleError);
    return { success: false, message: `Internal error during proof processing: ${merkleError.message}` };
  }

  const existingClaim = await ClaimModel.findOne({ eventId: event._id, attendeeAddress });
  if (existingClaim) {
    return { success: false, message: 'Token already claimed for this event.' };
  }

  let txSignature: string | undefined;
  try {
    const eventMintPublicKey = new PublicKey(event.mintAddress);
    const attendeePublicKey = new PublicKey(attendeeAddress);
    txSignature = await assignToken(eventMintPublicKey, attendeePublicKey);
  } catch (error: any) {
    console.error(`Solana token assignment failed for event ${eventId}, attendee ${attendeeAddress}:`, error);
    return { success: false, message: `Failed to assign token on Solana: ${error.message || 'Unknown error'}` };
  }

  try {
    const newClaim = new ClaimModel({
      eventId: event._id,
      attendeeAddress,
    });
    await newClaim.save();
  } catch (dbError: any) {
    console.error(`Database claim recording failed for event ${eventId}, attendee ${attendeeAddress} after Solana success (TX: ${txSignature}):`, dbError);
    return { success: true, message: 'Claim successful on Solana, but database record update failed. Please contact support if issues persist.', txSignature };
  }

  return { success: true, message: 'POPPass Claimed!', txSignature };
};