import { Item, WalletState } from './types';

// Tatum Sui RPC endpoint
const TATUM_SUI_RPC = 'https://sui-rpc-mainnet.tatum.io';
const TATUM_SUI_TESTNET_RPC = 'https://sui-rpc-testnet.tatum.io';

// Initialize with API key from environment
const API_KEY = process.env.NEXT_PUBLIC_TATUM_API_KEY || '';

// Get current network
const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet';
const RPC_URL = NETWORK === 'mainnet' ? TATUM_SUI_RPC : TATUM_SUI_TESTNET_RPC;

// Wallet state storage (in-memory for demo)
let currentMnemonic: string | null = null;
let currentAddress: string | null = null;

// Get wallet connection state
export async function getWalletState(): Promise<WalletState> {
  return {
    address: currentAddress,
    connected: !!currentAddress,
    connecting: false,
  };
}

// Connect wallet - generates a new mnemonic or uses provided one
export async function connectWallet(mnemonic?: string): Promise<string> {
  if (mnemonic) {
    currentMnemonic = mnemonic;
    currentAddress = await getAddressFromMnemonic(mnemonic);
  } else {
    // Generate a new mnemonic (24 words)
    const words = [
      'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon',
      'abandon', 'abandon', 'abandon', 'about', 'absent', 'absorb', 'abstract', 'absurd',
      'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic'
    ];
    currentMnemonic = words.join(' ');
    currentAddress = await getAddressFromMnemonic(currentMnemonic);
  }
  return currentAddress!;
}

// Disconnect wallet
export function disconnectWallet(): void {
  currentMnemonic = null;
  currentAddress = null;
}

// Get address from mnemonic (simplified - in production use proper derivation)
export async function getAddressFromMnemonic(mnemonic: string): Promise<string> {
  // For demo purposes, generate a valid Sui address from the mnemonic
  // In production, use @scure/bip39 and @scure/slp for proper derivation
  const address = '0x' + Array.from({ length: 40 }, (_, i) => {
    const charCode = mnemonic.charCodeAt(i % mnemonic.length);
    return ((charCode * (i + 1) * 7) % 16).toString(16);
  }).join('');
  return address;
}

// Make RPC call to Tatum
async function rpcCall<T>(method: string, params: any[] = []): Promise<T> {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC call failed: ${response.statusText}`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(result.error.message);
  }
  
  return result.result;
}

// Get NFTs by owner address
export async function getNFTsByOwner(address: string): Promise<Item[]> {
  try {
    const objects = await rpcCall<any[]>('suix_getOwnedObjects', [
      address,
      {
        filter: { StructType: '0xgear_vault::nft_minting::GearNFT' },
        options: { showContent: true, showType: true }
      }
    ]);

    // Parse objects into Item format
    return objects.map((obj: any) => ({
      id: obj.data.objectId,
      name: obj.data.content?.fields?.name || 'Unknown Item',
      description: obj.data.content?.fields?.description || '',
      rarity: (obj.data.content?.fields?.rarity || 1) as 1 | 2 | 3 | 4,
      stats: {
        attack: obj.data.content?.fields?.attack || 0,
        defense: obj.data.content?.fields?.defense || 0,
        speed: obj.data.content?.fields?.speed || 0,
        luck: obj.data.content?.fields?.luck || 0,
      },
      metadata_uri: obj.data.content?.fields?.metadata_uri || '',
      image_url: obj.data.content?.fields?.image_url || '',
      studio_id: obj.data.content?.fields?.studio_id || '',
      owner: obj.data.content?.fields?.owner || address,
      minted_at: obj.data.content?.fields?.minted_at || 0,
    }));
  } catch (error) {
    console.error('Error getting NFTs by owner:', error);
    return [];
  }
}

// Get NFT metadata
export async function getNFTMetadata(objectId: string): Promise<Item | null> {
  try {
    const result = await rpcCall<any>('sui_getObject', [
      objectId,
      { showContent: true }
    ]);

    if (!result.data) return null;

    return {
      id: result.data.objectId,
      name: result.data.content?.fields?.name || 'Unknown Item',
      description: result.data.content?.fields?.description || '',
      rarity: (result.data.content?.fields?.rarity || 1) as 1 | 2 | 3 | 4,
      stats: {
        attack: result.data.content?.fields?.attack || 0,
        defense: result.data.content?.fields?.defense || 0,
        speed: result.data.content?.fields?.speed || 0,
        luck: result.data.content?.fields?.luck || 0,
      },
      metadata_uri: result.data.content?.fields?.metadata_uri || '',
      image_url: result.data.content?.fields?.image_url || '',
      studio_id: result.data.content?.fields?.studio_id || '',
      owner: result.data.content?.fields?.owner || '',
      minted_at: result.data.content?.fields?.minted_at || 0,
    };
  } catch (error) {
    console.error('Error getting NFT metadata:', error);
    return null;
  }
}

// Transfer NFT (requires signing - demo returns mock)
export async function transferNFT(
  objectId: string,
  toAddress: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // In production, this would use proper transaction signing
    // For demo, we simulate the transaction
    const txHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    return { success: true, txHash };
  } catch (error: any) {
    console.error('Error transferring NFT:', error);
    return { success: false, error: error.message };
  }
}

// Mint NFT (demo function for testing)
export async function mintDemoNFT(
  name: string,
  description: string,
  rarity: number,
  stats: { attack: number; defense: number; speed: number; luck: number },
  metadataUri: string,
  imageUrl: string
): Promise<{ success: boolean; objectId?: string; txHash?: string; error?: string }> {
  try {
    // In production, this would create and submit a proper transaction
    // For demo, we return a mock result
    const objectId = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const txHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    return { success: true, objectId, txHash };
  } catch (error: any) {
    console.error('Error minting NFT:', error);
    return { success: false, error: error.message };
  }
}

// Get network info
export async function getNetworkInfo(): Promise<{ lastBlock: number; epoch: number } | null> {
  try {
    const lastBlock = await rpcCall<string>('sui_getLatestCheckpointSequenceNumber', []);
    return { lastBlock: parseInt(lastBlock), epoch: 0 };
  } catch (error) {
    console.error('Error getting network info:', error);
    return null;
  }
}

// Execute custom move call (requires signing)
export async function executeMoveCall(params: {
  packageObjectId: string;
  module: string;
  function: string;
  arguments: any[];
  typeArguments?: string[];
}): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // In production, build and sign the transaction properly
    const txHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    return { success: true, txHash };
  } catch (error: any) {
    console.error('Error executing move call:', error);
    return { success: false, error: error.message };
  }
}