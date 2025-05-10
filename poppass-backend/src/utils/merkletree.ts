import { MerkleTree } from 'merkletreejs';
import { createHash } from 'crypto';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

export function hashLeaf(data: Buffer): Buffer {
  return createHash('sha256').update(data).digest();
}

export function generateMerkleTree(allowlist: string[]): { tree: MerkleTree; root: string; leaves: Buffer[] } {
  if (!allowlist || allowlist.length === 0) {
      const emptyLeaf = hashLeaf(Buffer.from(''));
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

export function getMerkleProof(leaves: Buffer[], targetWalletAddress: string): string[] | null {
  try {
    const targetLeaf = hashLeaf(new PublicKey(targetWalletAddress).toBuffer());
    const tree = new MerkleTree(leaves, hashLeaf, { sortPairs: true });
    const proof = tree.getProof(targetLeaf);

    if (!tree.verify(proof, targetLeaf, tree.getRoot())) {
        return null;
    }

    return proof.map(p => p.data.toString('hex'));
  } catch (e) {
    console.error(`Error getting proof for ${targetWalletAddress}:`, e);
    return null;
  }
}

export function verifyMerkleProof(attendeeWalletAddress: string, proofHex: string[], rootHex: string): boolean {
  if (!proofHex || !rootHex || proofHex.length === 0 && !hashLeaf(new PublicKey(attendeeWalletAddress).toBuffer()).equals(Buffer.from(rootHex, 'hex'))) {
   
    if (proofHex.length === 0) {
        const leaf = hashLeaf(new PublicKey(attendeeWalletAddress).toBuffer());
        const rootBuffer = Buffer.from(rootHex, 'hex');
        return leaf.equals(rootBuffer);
    }
    return false;
  }

  try {
    const leaf = hashLeaf(new PublicKey(attendeeWalletAddress).toBuffer());
    const proofBuffers = proofHex.map(p => Buffer.from(p, 'hex'));
    const rootBuffer = Buffer.from(rootHex, 'hex');

    let computedHash = leaf;
    for (const proofElement of proofBuffers) {
      const combined = Buffer.compare(computedHash, proofElement) < 0
        ? Buffer.concat([computedHash, proofElement])
        : Buffer.concat([proofElement, computedHash]);
      computedHash = hashLeaf(combined);
    }
    return computedHash.equals(rootBuffer);

  } catch (e) {
    console.error(`Error verifying proof for ${attendeeWalletAddress}:`, e);
    return false;
  }
}