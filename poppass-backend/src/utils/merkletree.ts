import { MerkleTree } from 'merkletreejs';
import { createHash } from 'crypto';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer'; // Ensure Buffer is imported

// Consistent hashing function
export function hashLeaf(data: Buffer): Buffer {
  return createHash('sha256').update(data).digest();
}

// Generate tree and root from an allowlist of base58 addresses
export function generateMerkleTree(allowlist: string[]): { tree: MerkleTree; root: string; leaves: Buffer[] } {
  if (!allowlist || allowlist.length === 0) {
      // Handle empty list: create a tree with a placeholder or throw?
      // For consistency, let's create a tree with a single hash of an empty buffer or similar
      const emptyLeaf = hashLeaf(Buffer.from('')); // Or a predefined "empty" hash
      const tree = new MerkleTree([emptyLeaf], hashLeaf, { sortPairs: true });
      return { tree, root: tree.getRoot().toString('hex'), leaves: [emptyLeaf] };
  }

  const leaves = allowlist.map(addr => {
      try {
          return hashLeaf(new PublicKey(addr).toBuffer());
      } catch (e) {
          console.error(`Invalid public key format in allowlist: ${addr}`);
          throw new Error(`Invalid public key format: ${addr}`);
      }
  });

  const tree = new MerkleTree(leaves, hashLeaf, { sortPairs: true });
  const root = tree.getRoot().toString('hex');
  return { tree, root, leaves };
}

// Get proof for a specific attendee address (usually frontend, but useful for backend testing/logic)
export function getMerkleProof(leaves: Buffer[], targetWalletAddress: string): string[] | null {
  try {
    const targetLeaf = hashLeaf(new PublicKey(targetWalletAddress).toBuffer());
    // Need to recreate the tree to get the proof based on the leaf value
    const tree = new MerkleTree(leaves, hashLeaf, { sortPairs: true });
    const proof = tree.getProof(targetLeaf);

    // Verify the proof against the root calculated from the same leaves
    if (!tree.verify(proof, targetLeaf, tree.getRoot())) {
        return null; // Leaf is not in the tree
    }

    return proof.map(p => p.data.toString('hex'));
  } catch (e) {
    console.error(`Error getting proof for ${targetWalletAddress}:`, e);
    return null;
  }
}

// Verify proof on the backend
export function verifyMerkleProof(attendeeWalletAddress: string, proofHex: string[], rootHex: string): boolean {
  if (!proofHex || !rootHex) return false;
  try {
    const leaf = hashLeaf(new PublicKey(attendeeWalletAddress).toBuffer());
    const proofBuffers = proofHex.map(p => Buffer.from(p, 'hex'));
    const rootBuffer = Buffer.from(rootHex, 'hex');

    // Use the static verify method if available, or recalculate the root manually
    // Manual recalculation:
    let computedHash = leaf;
    for (const proofElement of proofBuffers) {
      const combined = Buffer.compare(computedHash, proofElement) < 0
        ? Buffer.concat([computedHash, proofElement])
        : Buffer.concat([proofElement, computedHash]);
      computedHash = hashLeaf(combined);
    }
    return computedHash.equals(rootBuffer);

    // OR if using MerkleTree static verify (requires library support/version check)
    // return MerkleTree.verify(proofBuffers, leaf, rootBuffer, hashLeaf, { sortPairs: true });
  } catch (e) {
    console.error(`Error verifying proof for ${attendeeWalletAddress}:`, e);
    return false;
  }
}