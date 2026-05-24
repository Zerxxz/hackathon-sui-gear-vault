import { ItemMetadata, WalrusUploadResult, WalrusRetrievalResult } from './types';

// Walrus API configuration
const WALRUS_API_URL = 'https://api.walrus.social';
const WALRUS_PUBLISHER_URL = 'https://publisher.walrus.social';

// Demo blob IDs for testing (pre-uploaded content)
const DEMO_BLOB_IDS = {
  dragon_sword: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  crystal_shield: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
  phantom_armor: 'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654',
  arcane_staff: '0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
  thunder_axe: '567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
};

// Demo metadata for items
const DEMO_METADATA: Record<string, ItemMetadata> = {
  [DEMO_BLOB_IDS.dragon_sword]: {
    name: 'Dragon Slayer Sword',
    description: 'A legendary blade forged in dragon fire. Capable of dealing devastating damage to dragon-kind.',
    image: '/items/dragon-sword.png',
    attributes: { attack: 85, defense: 20, speed: 15, luck: 10 },
    rarity: 4,
    game_compatible: ['Dragon Quest', 'Epic Fantasy MMO'],
    created_at: 1700000000,
  },
  [DEMO_BLOB_IDS.crystal_shield]: {
    name: 'Crystal Guardian Shield',
    description: 'A shield made of pure crystal that refracts incoming attacks.',
    image: '/items/crystal-shield.png',
    attributes: { attack: 10, defense: 90, speed: 5, luck: 25 },
    rarity: 3,
    game_compatible: ['Fortress Defense', 'Crystal Chronicles'],
    created_at: 1700001000,
  },
  [DEMO_BLOB_IDS.phantom_armor]: {
    name: 'Phantom Knight Armor',
    description: 'Lightweight armor woven from ethereal essence. Provides exceptional protection without slowing the wearer.',
    image: '/items/phantom-armor.png',
    attributes: { attack: 30, defense: 70, speed: 50, luck: 15 },
    rarity: 4,
    game_compatible: ['Phantom Warriors', 'Stealth Legends'],
    created_at: 1700002000,
  },
  [DEMO_BLOB_IDS.arcane_staff]: {
    name: 'Arcane Master Staff',
    description: 'A staff imbued with ancient arcane power. Enhances magical abilities.',
    image: '/items/arcane-staff.png',
    attributes: { attack: 60, defense: 40, speed: 45, luck: 35 },
    rarity: 3,
    game_compatible: ['Mage Academy', 'Arcane Quest'],
    created_at: 1700003000,
  },
  [DEMO_BLOB_IDS.thunder_axe]: {
    name: 'Thunder God Axe',
    description: 'An axe crackling with the power of lightning. Strikes with thunderous force.',
    image: '/items/thunder-axe.png',
    attributes: { attack: 95, defense: 25, speed: 35, luck: 20 },
    rarity: 4,
    game_compatible: ['Thunder Quest', 'Storm Raiders'],
    created_at: 1700004000,
  },
};

// Upload data to Walrus
export async function uploadToWalrus(data: any): Promise<WalrusUploadResult> {
  const start = performance.now();
  
  try {
    // In production, this would call the Walrus publisher API
    // For demo purposes, we simulate the upload
    const jsonData = JSON.stringify(data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Generate mock blob ID
    const blobId = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const timestamp = performance.now() - start;

    return {
      blobId,
      timestamp,
    };
  } catch (error) {
    console.error('Error uploading to Walrus:', error);
    throw error;
  }
}

// Retrieve data from Walrus by blob ID
export async function retrieveFromWalrus(blobId: string): Promise<WalrusRetrievalResult> {
  const start = performance.now();
  
  try {
    // Check if it's a demo blob ID
    if (DEMO_METADATA[blobId]) {
      const latency = performance.now() - start;
      return {
        data: DEMO_METADATA[blobId],
        latency,
        blobId,
      };
    }

    // In production, this would call the Walrus aggregator API
    // For demo, simulate retrieval
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    
    const data = { blobId, retrieved: true };
    const latency = performance.now() - start;

    return {
      data,
      latency,
      blobId,
    };
  } catch (error) {
    console.error('Error retrieving from Walrus:', error);
    throw error;
  }
}

// Get metadata for an item by blob ID
export async function getItemMetadata(blobId: string): Promise<ItemMetadata | null> {
  try {
    const result = await retrieveFromWalrus(blobId);
    return result.data as ItemMetadata;
  } catch (error) {
    console.error('Error getting item metadata:', error);
    return null;
  }
}

// Upload item image to Walrus
export async function uploadItemImage(imageData: string): Promise<WalrusUploadResult> {
  return uploadToWalrus({ image: imageData, type: 'item-image' });
}

// Get all demo items with metadata
export function getDemoItems(): Array<{ blobId: string; metadata: ItemMetadata }> {
  return Object.entries(DEMO_METADATA).map(([blobId, metadata]) => ({
    blobId,
    metadata,
  }));
}

// Get a specific demo item
export function getDemoItem(blobId: string): { blobId: string; metadata: ItemMetadata } | null {
  const metadata = DEMO_METADATA[blobId];
  if (!metadata) return null;
  return { blobId, metadata };
}

// Simulate Walrus storage latency test
export async function measureWalrusLatency(iterations: number = 5): Promise<{ 
  averageLatency: number; 
  minLatency: number; 
  maxLatency: number;
  results: number[];
}> {
  const results: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const result = await retrieveFromWalrus(Object.keys(DEMO_METADATA)[i % Object.keys(DEMO_METADATA).length]);
    results.push(result.latency);
  }

  return {
    averageLatency: results.reduce((a, b) => a + b, 0) / results.length,
    minLatency: Math.min(...results),
    maxLatency: Math.max(...results),
    results,
  };
}

// Check Walrus service health
export async function checkWalrusHealth(): Promise<{ healthy: boolean; latency: number }> {
  const start = performance.now();
  
  try {
    // Simulate health check
    await new Promise(resolve => setTimeout(resolve, 50));
    const latency = performance.now() - start;
    
    return { healthy: true, latency };
  } catch {
    return { healthy: false, latency: -1 };
  }
}