import { Request, Response } from 'express';
import { PublicKey } from '@solana/web3.js';
import * as eventService from '../services/eventService';

export const createEventHandler = async (req: Request, res: Response): Promise<void> => {
  const { name, description, creatorAddress, allowlist } = req.body;

  if (!name || !description || !creatorAddress || !Array.isArray(allowlist)) {
    res.status(400).json({ message: 'Missing required fields: name, description, creatorAddress, allowlist (array).' });
    return;
  }

  const isValidSolanaAddress = (address: any): boolean => {
    if (typeof address !== 'string') {
        return false;
    }
    try {
      new PublicKey(address);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (!isValidSolanaAddress(creatorAddress)) {
    res.status(400).json({ message: `Invalid format for creatorAddress: ${creatorAddress}. Please provide a valid Solana public key.` });
    return;
  }

  if (allowlist.length > 0) {
    const invalidAddressesInAllowlist = allowlist.filter((addr: any) => !isValidSolanaAddress(addr));
    if (invalidAddressesInAllowlist.length > 0) {
      res.status(400).json({
        message: `Invalid Solana address(es) found in allowlist: ${invalidAddressesInAllowlist.join(', ')}. Please ensure all addresses are valid Solana public keys.`
      });
      return;
    }
  }

  try {
    const newEvent = await eventService.createEvent(name, description, creatorAddress, allowlist);
    res.status(201).json({
        message: 'Event created successfully',
        eventId: newEvent._id,
        mintAddress: newEvent.mintAddress,
        merkleRoot: newEvent.merkleRoot,
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    if (error.message && error.message.includes('Invalid public key format')) {
        res.status(400).json({ message: `Failed to create event: ${error.message}` });
    } else {
        res.status(500).json({ message: `Failed to create event: ${error.message || 'Internal server error'}` });
    }
  }
};

export const getPublicEventDetailsHandler = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;
  if (!eventId) {
    res.status(400).json({ message: "Event ID is required." });
    return;
  }

  try {
    const eventDetails = await eventService.getPublicEventDetails(eventId);
    if (!eventDetails) {
      res.status(404).json({ message: "Event not found." });
      return;
    }
    res.status(200).json(eventDetails);
  } catch (error: any) {
    console.error(`Error fetching public details for event ${eventId}:`, error);
    res.status(500).json({ message: `Failed to fetch event details: ${error.message || 'Internal server error'}` });
  }
};