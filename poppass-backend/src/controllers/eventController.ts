import { Request, Response } from 'express';
import * as eventService from '../services/eventService';
// import EventModel from '../models/Event'; // Uncomment if using QR code endpoint
// import qrcode from 'qrcode'; // Uncomment if implementing QR code endpoint

// Add : Promise<void>
export const createEventHandler = async (req: Request, res: Response): Promise<void> => {
  const { name, description, creatorAddress, allowlist } = req.body;

  // Basic validation
  if (!name || !description || !creatorAddress || !Array.isArray(allowlist)) {
    // Ensure response is sent before returning
    res.status(400).json({ message: 'Missing required fields: name, description, creatorAddress, allowlist (array).' });
    return; // Added return here
  }
  // TODO: Add Solana address validation for creatorAddress and allowlist entries

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
    res.status(500).json({ message: `Failed to create event: ${error.message || 'Internal server error'}` });
  }
};

// Optional: QR Code Endpoint
/*
// Add : Promise<void>
export const getEventQrCodeHandler = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;
  try {
    const event = await EventModel.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' }); // Ensure response
      return; // Added return
    }
    const claimUrl = `${event.claimLinkBase}${event._id}`; // Construct the full claim URL

    const qrCodeDataUrl = await qrcode.toDataURL(claimUrl);
    res.status(200).json({ qrCodeDataUrl });

  } catch (error: any) {
    console.error(`Error generating QR code for event ${eventId}:`, error);
    res.status(500).json({ message: `Failed to generate QR code: ${error.message || 'Internal server error'}` });
  }
};
*/