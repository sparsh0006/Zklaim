import EventModel from '../models/Event';
import ClaimModel from '../models/Claim';
import { verifyMerkleProof } from '../utils/merkletree';
import { assignToken } from './solanaService';
import { PublicKey } from '@solana/web3.js';

export const claimToken = async (
  eventId: string,
  attendeeAddress: string,
  merkleProofHex: string[]
): Promise<{ success: boolean; message: string; txSignature?: string }> => {

  // 1. Validate Inputs (basic)
  if (!eventId || !attendeeAddress || !merkleProofHex) {
    return { success: false, message: 'Missing required claim information.' };
  }
  try {
      new PublicKey(attendeeAddress); // Validate attendee address format
  } catch (e) {
       return { success: false, message: 'Invalid attendee wallet address format.' };
  }

  // 2. Find Event
  const event = await EventModel.findById(eventId);
  if (!event) {
    return { success: false, message: 'Event not found.' };
  }

  // 3. Check if Attendee is even on the Allowlist
  // Note: Case-sensitive comparison is important for Base58 addresses
  if (!event.allowlist.includes(attendeeAddress)) {
      return { success: false, message: 'Attendee address not found in event allowlist.' };
  }

  // 4. Verify Merkle Proof (now we know the address *should* be verifiable)
  const isProofValid = verifyMerkleProof(attendeeAddress, merkleProofHex, event.merkleRoot);
  if (!isProofValid) {
    // Address was on the list, but the provided proof didn't match the root.
    return { success: false, message: 'Invalid Merkle proof provided.' };
  }

  // --- Proof is valid for an allowlisted address, proceed ---

  // 5. Check if already claimed (Moved Down)
  const existingClaim = await ClaimModel.findOne({ eventId: event._id, attendeeAddress });
  if (existingClaim) {
    // Eligible based on proof but already claimed.
    return { success: false, message: 'Token already claimed for this event.' };
  }

  // 6. Assign the Compressed Token via Solana Service (Checks passed)
  let txSignature: string | undefined;
  try {
    const eventMintPublicKey = new PublicKey(event.mintAddress);
    const attendeePublicKey = new PublicKey(attendeeAddress);
    txSignature = await assignToken(eventMintPublicKey, attendeePublicKey);
  } catch (error: any) {
    console.error(`Solana token assignment failed for event ${eventId}, attendee ${attendeeAddress}:`, error);
    return { success: false, message: `Failed to assign token on Solana: ${error.message || 'Unknown error'}` };
  }

  // 7. Record the Claim in DB
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

  // 8. Success
  return { success: true, message: 'POPPass Claimed!', txSignature };
};