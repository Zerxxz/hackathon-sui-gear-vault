import { NextRequest, NextResponse } from 'next/server';

// Demo metadata for items (in production, this would query the actual Walrus network)
const DEMO_METADATA: Record<string, any> = {
  'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890': {
    name: 'Dragon Slayer Sword',
    description: 'A legendary blade forged in dragon fire. Capable of dealing devastating damage to dragon-kind.',
    image: '/items/dragon-sword.png',
    attributes: { attack: 85, defense: 20, speed: 15, luck: 10 },
    rarity: 4,
    game_compatible: ['Dragon Quest', 'Epic Fantasy MMO'],
    created_at: 1700000000,
  },
  '1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab': {
    name: 'Crystal Guardian Shield',
    description: 'A shield made of pure crystal that refracts incoming attacks.',
    image: '/items/crystal-shield.png',
    attributes: { attack: 10, defense: 90, speed: 5, luck: 25 },
    rarity: 3,
    game_compatible: ['Fortress Defense', 'Crystal Chronicles'],
    created_at: 1700001000,
  },
  'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654': {
    name: 'Phantom Knight Armor',
    description: 'Lightweight armor woven from ethereal essence. Provides exceptional protection without slowing the wearer.',
    image: '/items/phantom-armor.png',
    attributes: { attack: 30, defense: 70, speed: 50, luck: 15 },
    rarity: 4,
    game_compatible: ['Phantom Warriors', 'Stealth Legends'],
    created_at: 1700002000,
  },
  '0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456': {
    name: 'Arcane Master Staff',
    description: 'A staff imbued with ancient arcane power. Enhances magical abilities.',
    image: '/items/arcane-staff.png',
    attributes: { attack: 60, defense: 40, speed: 45, luck: 35 },
    rarity: 3,
    game_compatible: ['Mage Academy', 'Arcane Quest'],
    created_at: 1700003000,
  },
  '567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12': {
    name: 'Thunder God Axe',
    description: 'An axe crackling with the power of lightning. Strikes with thunderous force.',
    image: '/items/thunder-axe.png',
    attributes: { attack: 95, defense: 25, speed: 35, luck: 20 },
    rarity: 4,
    game_compatible: ['Thunder Quest', 'Storm Raiders'],
    created_at: 1700004000,
  },
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

  // Simulate network latency (in production, this would be actual Walrus retrieval)
  await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));

  const latency = performance.now() - start;

  // Check if it's a known demo blob
  const metadata = DEMO_METADATA[blobId];
  
  if (metadata) {
    return NextResponse.json({
      success: true,
      data: metadata,
      latency,
      blobId,
      source: 'Walrus (Demo)',
    });
  }

  // For unknown blobs, return a generic response
  return NextResponse.json({
    success: true,
    data: {
      blobId,
      retrieved: true,
      timestamp: Date.now(),
    },
    latency,
    blobId,
    source: 'Walrus Network',
  });
}