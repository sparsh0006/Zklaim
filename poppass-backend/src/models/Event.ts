import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  creatorAddress: string; 
  mintAddress: string; 
  allowlist: string[]; 
  merkleRoot: string; 
  claimLinkBase: string; 
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creatorAddress: { type: String, required: true, index: true },
  mintAddress: { type: String, required: true, unique: true },
  allowlist: [{ type: String }], 
  merkleRoot: { type: String, required: true },
  claimLinkBase: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IEvent>('Event', EventSchema);