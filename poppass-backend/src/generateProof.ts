// generateProof.ts
import { generateMerkleTree, getMerkleProof } from './utils/merkletree'; // Adjust path if needed
import { Buffer } from 'buffer'; // Make sure Buffer is available

// --- IMPORTANT: Use the *exact* same allowlist as when creating the event ---
const allowlist = [
  "EEWQu9BPi9fSov1L6PmvhkKwCueF7mEvTaVc1AifskMU",
  "5tE6hDPXTdFg3hVPBhYqBsANsdw2ZTCDfswxJEhbHk81"
];
// --- Choose which attendee you are generating the proof for ---
const attendeeToProve = "5tE6hDPXTdFg3hVPBhYqBsANsdw2ZTCDfswxJEhbHk81"; // Or the other one

const { leaves, root } = generateMerkleTree(allowlist);
console.log("Calculated Merkle Root:", root); // Verify this matches the root from your API response!
const proof = getMerkleProof(leaves, attendeeToProve);

if (proof) {
  console.log(`\nProof for ${attendeeToProve}:`);
  // Output in JSON array format, ready to copy/paste
  console.log(JSON.stringify(proof));
} else {
  console.error(`Could not generate proof for ${attendeeToProve}. Is the address in the allowlist?`);
}