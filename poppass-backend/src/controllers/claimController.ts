import { Request, Response } from 'express';
import * as claimService from '../services/claimService';

// Add : Promise<void>
export const claimTokenHandler = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;
  const { attendeeAddress, merkleProof } = req.body;

  if (!attendeeAddress || !merkleProof || !Array.isArray(merkleProof)) {
      // Ensure response is sent before returning
      res.status(400).json({ message: 'Missing required fields: attendeeAddress, merkleProof (array).' });
      return; // Added return
  }

  try {
    const result = await claimService.claimToken(eventId, attendeeAddress, merkleProof);

    if (result.success) {
      res.status(200).json({ message: result.message, transactionSignature: result.txSignature });
    } else {
      const statusCode = result.message.includes('already claimed') ? 409 : 400;
      res.status(statusCode).json({ message: result.message });
    }
  } catch (error: any) {
    console.error(`Error processing claim for event ${eventId}, attendee ${attendeeAddress}:`, error);
    res.status(500).json({ message: `Failed to process claim: ${error.message || 'Internal server error'}` });
  }
};