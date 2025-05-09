import { Request, Response } from 'express';
import * as eventService from '../services/eventService';
import { PublicKey } from '@solana/web3.js'; // Import Solana public key class

export const createEventHandler = async (req: Request, res: Response): Promise<void> => {
  const { name, description, creatorAddress, allowlist } = req.body;

  // Basic validation for presence of fields
  if (!name || !description || !creatorAddress || !Array.isArray(allowlist)) {
    res.status(400).json({ message: 'Missing required fields: name, description, creatorAddress, allowlist (array).' });
    return;
  }

  // Helper function for Solana address validation
  const isValidSolanaAddress = (address: any): boolean => { // Added 'any' type for address to handle non-string inputs gracefully
    if (typeof address !== 'string') {
        return false; // Not a string, so not a valid address format
    }
    try {
      new PublicKey(address);
      return true;
    } catch (e) { // Catch specific error if needed, but for boolean, catch is enough
      return false;
    }
  };

  // Validate creatorAddress
  if (!isValidSolanaAddress(creatorAddress)) {
    res.status(400).json({ message: `Invalid format for creatorAddress: ${creatorAddress}. Please provide a valid Solana public key.` });
    return;
  }

  // Validate allowlist entries
  if (allowlist.length > 0) {
    const invalidAddressesInAllowlist = allowlist.filter((addr: any) => !isValidSolanaAddress(addr));
    if (invalidAddressesInAllowlist.length > 0) {
      res.status(400).json({
        message: `Invalid Solana address(es) found in allowlist: ${invalidAddressesInAllowlist.join(', ')}. Please ensure all addresses are valid Solana public keys.`
      });
      return;
    }
  }
  // If you want to disallow empty allowlists, you can add a check here:
  // else {
  //   res.status(400).json({ message: 'Allowlist cannot be empty for event creation.' });
  //   return;
  // }
  // For now, assuming your backend/merkletree.ts handles an empty allowlist gracefully if needed.

  try {
    const newEvent = await eventService.createEvent(name, description, creatorAddress, allowlist);
    // Respond with relevant event details
    res.status(201).json({
        message: 'Event created successfully',
        eventId: newEvent._id,
        mintAddress: newEvent.mintAddress,
        merkleRoot: newEvent.merkleRoot,
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    // Check if the error is from the Merkle tree utility due to invalid pubkey format
    // (this is a fallback, as the controller should catch most format issues now)
    if (error.message && error.message.includes('Invalid public key format')) {
        res.status(400).json({ message: `Failed to create event: ${error.message}` });
    } else {
        res.status(500).json({ message: `Failed to create event: ${error.message || 'Internal server error'}` });
    }
  }
};

// Optional: QR Code Endpoint (remains unchanged)
/*
export const getEventQrCodeHandler = async (req: Request, res: Response): Promise<void> => {
  // ... (existing QR code logic) ...
};
*/