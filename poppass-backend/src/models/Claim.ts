import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClaim extends Document {
  eventId: Types.ObjectId; 
  attendeeAddress: string; 
  claimedAt: Date;
}

const ClaimSchema: Schema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  attendeeAddress: { type: String, required: true },
  claimedAt: { type: Date, default: Date.now },
});

ClaimSchema.index({ eventId: 1, attendeeAddress: 1 }, { unique: true });

export default mongoose.model<IClaim>('Claim', ClaimSchema);