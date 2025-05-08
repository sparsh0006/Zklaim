import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClaim extends Document {
  eventId: Types.ObjectId; // Reference to the Event
  attendeeAddress: string; // Solana address
  claimedAt: Date;
}

const ClaimSchema: Schema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  attendeeAddress: { type: String, required: true },
  claimedAt: { type: Date, default: Date.now },
});

// Ensure an attendee can only claim once per event
ClaimSchema.index({ eventId: 1, attendeeAddress: 1 }, { unique: true });

export default mongoose.model<IClaim>('Claim', ClaimSchema);