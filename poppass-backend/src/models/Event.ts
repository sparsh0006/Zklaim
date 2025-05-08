import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  creatorAddress: string; // Solana address
  mintAddress: string; // Solana address of the POPPass compressed token mint
  allowlist: string[]; // List of allowed Solana addresses
  merkleRoot: string; // Hex string of the Merkle root
  claimLinkBase: string; // e.g., "http://localhost:5001/api/claim/"
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creatorAddress: { type: String, required: true, index: true },
  mintAddress: { type: String, required: true, unique: true },
  allowlist: [{ type: String }], // Array of strings
  merkleRoot: { type: String, required: true },
  claimLinkBase: { type: String, required: true }, // Auto-generated potentially
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IEvent>('Event', EventSchema);