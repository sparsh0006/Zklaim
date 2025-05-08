import { MerkleTree } from 'merkletreejs';
import { createHash } from 'crypto';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

export function hashLeaf(data: Buffer): Buffer {
  return Buffer.from(createHash('sha256').update(data).digest());
}

export function generateMerkleTree(allowlist: string[]): { tree: MerkleTree; root: string; leaves: Buffer[] } {
  if (!allowlist || allowlist.length === 0) {
    const emptyLeaf = hashLeaf(Buffer.from(''));
    const tree = new MerkleTree([emptyLeaf], (el: Buffer) => el, { hashLeaves: false, sortPairs: true });
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

  const tree = new MerkleTree(leaves, (el: Buffer) => el, { hashLeaves: false, sortPairs: true });
  const root = tree.getRoot().toString('hex');
  return { tree, root, leaves };
}

export function getMerkleProof(allowlist: string[], targetWalletAddress: string): string[] | null {
  if (!allowlist || allowlist.length === 0) return null;
  try {
    const leaves = allowlist.map(addr => {
        try {
            return hashLeaf(new PublicKey(addr).toBuffer());
        } catch (e) {
            console.error(`Invalid public key format in allowlist for proof gen: ${addr}`);
            throw new Error(`Invalid public key format for proof gen: ${addr}`);
        }
    });

    const targetLeaf = hashLeaf(new PublicKey(targetWalletAddress).toBuffer());
    const tree = new MerkleTree(leaves, (el: Buffer) => el, { hashLeaves: false, sortPairs: true });
    const proof = tree.getProof(targetLeaf);

    if (!proof || proof.length === 0) {
        if (tree.getRoot().equals(targetLeaf)) {
            return [];
        }
        console.warn(`Proof could not be generated for ${targetWalletAddress}. Is it in the allowlist?`);
        return null;
    }

     if (!tree.verify(proof, targetLeaf, tree.getRoot())) {
         console.error(`Generated proof for ${targetWalletAddress} is invalid.`);
         return null;
     }

    return proof.map(p => p.data.toString('hex'));
  } catch (e) {
    console.error(`Error getting proof for ${targetWalletAddress}:`, e);
    return null;
  }
}