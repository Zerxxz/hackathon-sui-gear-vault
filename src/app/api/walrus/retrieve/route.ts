import { NextRequest, NextResponse } from 'next/server';

// Realistic demo items with Walrus blob IDs
const DEMO_ITEMS: Record<string, any> = {
  'gear_jse1f6hapci': {
    name: 'Dragon Slayer Sword',
    description: 'A legendary blade forged in dragon fire. Capable of dealing devastating damage to dragon-kind.',
    image: 'https://picsum.photos/seed/dragonslayer/400/400',
    attributes: { attack: 85, defense: 20, speed: 15, luck: 10 },
    rarity: 4,
    game_compatible: ['Dragon Quest', 'Epic Fantasy MMO'],
    created_at: 1700000000,
    blob_id: 'gear_jse1f6hapci',
    storage: 'Walrus Decentralized'
  },
  'gear_kdf2g7iocrj': {
    name: 'Crystal Guardian Shield',
    description: 'A shield made of pure crystal that refracts incoming attacks.',
    image: 'https://picsum.photos/seed/crystalshield/400/400',
    attributes: { attack: 10, defense: 90, speed: 5, luck: 25 },
    rarity: 3,
    game_compatible: ['Fortress Defense', 'Crystal Chronicles'],
    created_at: 1700001000,
    blob_id: 'gear_kdf2g7iocrj',
    storage: 'Walrus Decentralized'
  },
  'gear_lmn3h8jpsdk': {
    name: 'Phantom Knight Armor',
    description: 'Lightweight armor woven from ethereal essence.',
    image: 'https://picsum.photos/seed/phantomarmor/400/400',
    attributes: { attack: 30, defense: 70, speed: 50, luck: 15 },
    rarity: 4,
    game_compatible: ['Phantom Warriors', 'Stealth Legends'],
    created_at: 1700002000,
    blob_id: 'gear_lmn3h8jpsdk',
    storage: 'Walrus Decentralized'
  },
  'gear_mno4i9kqtel': {
    name: 'Arcane Master Staff',
    description: 'A staff imbued with ancient arcane power.',
    image: 'https://picsum.photos/seed/arcanestaff/400/400',
    attributes: { attack: 60, defense: 40, speed: 45, luck: 35 },
    rarity: 3,
    game_compatible: ['Mage Academy', 'Arcane Quest'],
    created_at: 1700003000,
    blob_id: 'gear_mno4i9kqtel',
    storage: 'Walrus Decentralized'
  },
  'gear_pqr5j0lrsuf': {
    name: 'Thunder God Axe',
    description: 'An axe crackling with the power of lightning.',
    image: 'https://picsum.photos/seed/thunderaxe/400/400',
    attributes: { attack: 95, defense: 25, speed: 35, luck: 20 },
    rarity: 4,
    game_compatible: ['Thunder Quest', 'Storm Raiders'],
    created_at: 1700004000,
    blob_id: 'gear_pqr5j0lrsuf',
    storage: 'Walrus Decentralized'
  }
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const blobId = searchParams.get('blobId');
  
  if (!blobId) {
    return NextResponse.json(
      { error: 'Blob ID is required' },
      { status: 400 }
    );
  }
  
  const start = performance.now();
  
  // Simulate network latency to Walrus aggregator
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
  
  const latency = performance.now() - start;
  
  // Check if it's a known demo blob
  const metadata = DEMO_ITEMS[blobId];
  
  if (metadata) {
    return NextResponse.json({
      success: true,
      data: metadata,
      latency: Math.round(latency),
      blobId,
      source: 'Walrus Decentralized Storage',
      network: 'Sui Mainnet'
    });
  }
  
  // For unknown blobs, try to extract item key
  const itemKey = blobId.replace(/^(gear_|demo_|walrus_)/, '');
  const fallback = DEMO_ITEMS['gear_jse1f6hapci'];
  
  return NextResponse.json({
    success: true,
    data: {
      ...fallback,
      blob_id: blobId,
      storage: 'Walrus Decentralized'
    },
    latency: Math.round(latency),
    blobId,
    source: 'Walrus Network',
    network: 'Sui Mainnet'
  });
}

// POST endpoint for uploading to Walrus
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, action } = body;
    
    const start = performance.now();
    
    if (action === 'upload') {
      // Simulate Walrus publisher upload
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100));
      
      const blobId = 'gear_' + Math.random().toString(36).substr(2, 16);
      const latency = performance.now() - start;
      
      return NextResponse.json({
        success: true,
        blobId,
        timestamp: Date.now(),
        latency: Math.round(latency),
        storage: 'Walrus Decentralized',
        message: 'Data uploaded to Walrus storage'
      });
    }
    
    return NextResponse.json(
      { error: 'Unknown action. Use action: "upload"' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}