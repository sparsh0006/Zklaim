import { Request, Response } from 'express';
import * as claimService from '../services/claimService';
import { PublicKey } from '@solana/web3.js'; // Keep for address validation

export const claimTokenHandler = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;
  const { attendeeAddress } = req.body; // REMOVED: merkleProof from req.body

  // Basic validation for presence of fields
  // MerkleProof is no longer expected from the client
  if (!attendeeAddress) {
      res.status(400).json({ message: 'Missing required field: attendeeAddress.' });
      return;
  }

  // Optional: Validate attendeeAddress format here as well, though service does it too
  try {
    new PublicKey(attendeeAddress);
  } catch (e) {
    res.status(400).json({ message: `Invalid attendeeAddress format: ${attendeeAddress}` });
    return;
  }

  try {
    // Call service without merkleProof
    const result = await claimService.claimToken(eventId, attendeeAddress);

    if (result.success) {
      res.status(200).json({ message: result.message, transactionSignature: result.txSignature });
    } else {
      // Determine appropriate status code based on message
      let statusCode = 400; // Default bad request
      if (result.message.includes('already claimed')) {
        statusCode = 409; // Conflict
      } else if (result.message.includes('not found in event allowlist')) {
        statusCode = 403; // Forbidden (or 404 if you prefer event/user combo not found)
      } else if (result.message.includes('Event not found')) {
        statusCode = 404;
      }
      // Add more specific status codes based on other potential error messages from service
      res.status(statusCode).json({ message: result.message });
    }
  } catch (error: any) {
    console.error(`Error processing claim for event ${eventId}, attendee ${attendeeAddress}:`, error);
    res.status(500).json({ message: `Failed to process claim: ${error.message || 'Internal server error'}` });
  }
};