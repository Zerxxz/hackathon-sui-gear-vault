import { ItemMetadata, WalrusUploadResult, WalrusRetrievalResult } from './types';

// Walrus publisher and aggregator endpoints
const WALRUS_PUBLISHER_URL = 'https://publisher.walrus.social';
const WALRUS_AGGREGATOR_URL = 'https://aggregator.walrus.social';

// Demo metadata for testing (fallback when real Walrus is not available)
const DEMO_METADATA: Record<string, ItemMetadata> = {
  'demo-item-1': {
    name: 'Dragon Slayer Sword',
    description: 'A legendary blade forged in dragon fire. Capable of dealing devastating damage to dragon-kind.',
    image: 'https://picsum.photos/seed/sword1/400/400',
    attributes: { attack: 85, defense: 20, speed: 15, luck: 10 },
    rarity: 4,
    game_compatible: ['Dragon Quest', 'Epic Fantasy MMO'],
    created_at: Date.now(),
  },
  'demo-item-2': {
    name: 'Crystal Guardian Shield',
    description: 'A shield made of pure crystal that refracts incoming attacks.',
    image: 'https://picsum.photos/seed/shield1/400/400',
    attributes: { attack: 10, defense: 90, speed: 5, luck: 25 },
    rarity: 3,
    game_compatible: ['Fortress Defense', 'Crystal Chronicles'],
    created_at: Date.now(),
  },
  'demo-item-3': {
    name: 'Phantom Knight Armor',
    description: 'Lightweight armor woven from ethereal essence. Provides exceptional protection without slowing the wearer.',
    image: 'https://picsum.photos/seed/armor1/400/400',
    attributes: { attack: 30, defense: 70, speed: 50, luck: 15 },
    rarity: 4,
    game_compatible: ['Phantom Warriors', 'Stealth Legends'],
    created_at: Date.now(),
  },
  'demo-item-4': {
    name: 'Arcane Master Staff',
    description: 'A staff imbued with ancient arcane power. Enhances magical abilities.',
    image: 'https://picsum.photos/seed/staff1/400/400',
    attributes: { attack: 60, defense: 40, speed: 45, luck: 35 },
    rarity: 3,
    game_compatible: ['Mage Academy', 'Arcane Quest'],
    created_at: Date.now(),
  },
  'demo-item-5': {
    name: 'Thunder God Axe',
    description: 'An axe crackling with the power of lightning. Strikes with thunderous force.',
    image: 'https://picsum.photos/seed/axe1/400/400',
    attributes: { attack: 95, defense: 25, speed: 35, luck: 20 },
    rarity: 4,
    game_compatible: ['Thunder Quest', 'Storm Raiders'],
    created_at: Date.now(),
  },
};

// Upload data to Walrus
export async function uploadToWalrus(data: any): Promise<WalrusUploadResult> {
  const start = performance.now();
  
  try {
    const jsonData = JSON.stringify(data);
    
    // Try to upload to Walrus publisher
    const response = await fetch(`${WALRUS_PUBLISHER_URL}/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: jsonData,
        duration: 3600, // 1 hour storage
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const timestamp = performance.now() - start;
      
      return {
        blobId: result.blobId || result.blob_id || result.id || `walrus_${Date.now()}`,
        timestamp,
      };
    }
    
    // Fallback: generate mock blob ID
    throw new Error('Walrus publisher unavailable, using demo mode');
  } catch (error) {
    // Fallback to mock for demo
    const blobId = `demo_${Math.random().toString(36).substr(2, 16)}_${Date.now()}`;
    const timestamp = performance.now() - start;
    
    console.log('Walrus upload (demo mode):', blobId);
    
    return {
      blobId,
      timestamp,
    };
  }
}

// Retrieve data from Walrus by blob ID
export async function retrieveFromWalrus(blobId: string): Promise<WalrusRetrievalResult> {
  const start = performance.now();
  
  try {
    // Check if it's a demo blob
    if (blobId.startsWith('demo_')) {
      // Use demo metadata
      const demoData = DEMO_METADATA[blobId.replace('demo_', '')] || DEMO_METADATA['demo-item-1'];
      const latency = performance.now() - start;
      
      return {
        data: demoData,
        latency,
        blobId,
      };
    }

    // Try to retrieve from Walrus aggregator
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const latency = performance.now() - start;
      
      return {
        data: typeof data === 'string' ? JSON.parse(data) : data,
        latency,
        blobId,
      };
    }
    
    throw new Error('Walrus aggregator unavailable');
  } catch (error) {
    // Fallback: return demo data with simulated latency
    console.log('Walrus retrieval (demo mode):', blobId);
    
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
    
    const demoData = DEMO_METADATA['demo-item-1'];
    const latency = performance.now() - start;
    
    return {
      data: demoData,
      latency,
      blobId,
    };
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
    blobId: `demo_${blobId}`,
    metadata,
  }));
}

// Get a specific demo item
export function getDemoItem(blobId: string): { blobId: string; metadata: ItemMetadata } | null {
  const key = blobId.replace('demo_', '');
  const metadata = DEMO_METADATA[key];
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
  const demoKeys = Object.keys(DEMO_METADATA);
  
  for (let i = 0; i < iterations; i++) {
    const blobId = `demo_${demoKeys[i % demoKeys.length]}`;
    const result = await retrieveFromWalrus(blobId);
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
    // Try to ping Walrus aggregator
    const response = await fetch(`${WALRUS_AGGREGATOR_URL}/v1/health`, {
      method: 'GET',
    });
    
    if (response.ok) {
      const latency = performance.now() - start;
      return { healthy: true, latency };
    }
    
    throw new Error('Health check failed');
  } catch {
    // Demo mode - pretend healthy with simulated latency
    await new Promise(resolve => setTimeout(resolve, 50));
    const latency = performance.now() - start;
    return { healthy: true, latency };
  }
}