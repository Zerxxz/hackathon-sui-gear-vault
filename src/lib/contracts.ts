import { Item, Studio } from './types';

// Contract addresses (to be updated after deployment)
export const CONTRACT_ADDRESSES = {
  mainnet: {
    package: process.env.NEXT_PUBLIC_MAINNET_PACKAGE || '0x0',
    registry: process.env.NEXT_PUBLIC_MAINNET_REGISTRY || '0x0',
  },
  testnet: {
    package: process.env.NEXT_PUBLIC_TESTNET_PACKAGE || '0x0',
    registry: process.env.NEXT_PUBLIC_TESTNET_REGISTRY || '0x0',
  },
};

// Contract ABI/interface definitions
export const CONTRACT_ABI = {
  nft_minting: {
    mint_item: {
      inputs: {
        name: 'string',
        description: 'string',
        rarity: 'u8',
        attack: 'u32',
        defense: 'u32',
        speed: 'u32',
        luck: 'u32',
        metadata_uri: 'string',
        image_url: 'string',
      },
      output: 'ID',
    },
    transfer_item: {
      inputs: {
        registry: 'address',
        nft_id: 'ID',
        to: 'address',
      },
      output: 'void',
    },
    burn_item: {
      inputs: {
        registry: 'address',
        nft_id: 'ID',
      },
      output: 'void',
    },
    get_nft: {
      inputs: { registry: 'address', nft_id: 'ID' },
      output: 'GearNFT',
    },
    get_nfts_by_owner: {
      inputs: { registry: 'address', owner: 'address' },
      output: 'vector<ID>',
    },
  },
  item_registry: {
    create_item: {
      inputs: {
        name: 'string',
        rarity: 'u8',
        attack: 'u32',
        defense: 'u32',
        speed: 'u32',
        luck: 'u32',
        metadata_uri: 'string',
        studio_id: 'ID',
      },
      output: 'Item',
    },
    register_item: {
      inputs: { registry: 'address', item: 'Item' },
      output: 'void',
    },
    get_item: {
      inputs: { registry: 'address', item_id: 'ID' },
      output: 'Item',
    },
  },
  studio_manager: {
    create_studio: {
      inputs: { name: 'string' },
      output: 'Studio',
    },
    whitelist_item: {
      inputs: { studio: 'Studio', item_id: 'ID' },
      output: 'void',
    },
    is_item_whitelisted: {
      inputs: { studio: 'Studio', item_id: 'ID' },
      output: 'bool',
    },
  },
};

// Helper function to get contract address for current network
export function getContractAddress(network: 'mainnet' | 'testnet'): string {
  return network === 'mainnet' ? CONTRACT_ADDRESSES.mainnet.package : CONTRACT_ADDRESSES.testnet.package;
}

// Parse NFT object from contract response
export function parseNFTObject(data: any): Item | null {
  if (!data || !data.data) return null;

  const fields = data.data.fields;
  if (!fields) return null;

  return {
    id: fields.id?.id || '',
    name: fields.name || '',
    description: fields.description || '',
    rarity: fields.rarity || 1,
    stats: {
      attack: fields.attack || 0,
      defense: fields.defense || 0,
      speed: fields.speed || 0,
      luck: fields.luck || 0,
    },
    metadata_uri: fields.metadata_uri || '',
    image_url: fields.image_url || '',
    studio_id: fields.studio_id || '',
    owner: fields.owner || '',
    minted_at: fields.minted_at || 0,
    power_score: calculatePowerScore(fields),
  };
}

// Calculate power score from stats
export function calculatePowerScore(data: any): number {
  const stats = data.stats || data;
  return (stats.attack || 0) + (stats.defense || 0) + (stats.speed || 0) + (stats.luck || 0);
}

// Validate contract inputs
export function validateMintInputs(data: {
  name: string;
  description: string;
  rarity: number;
  stats: { attack: number; defense: number; speed: number; luck: number };
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.length === 0) {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  if (!data.description || data.description.length === 0) {
    errors.push('Description is required');
  } else if (data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  if (data.rarity < 1 || data.rarity > 4) {
    errors.push('Rarity must be between 1 and 4');
  }

  const { attack, defense, speed, luck } = data.stats;
  if (attack < 0 || attack > 100) errors.push('Attack must be between 0 and 100');
  if (defense < 0 || defense > 100) errors.push('Defense must be between 0 and 100');
  if (speed < 0 || speed > 100) errors.push('Speed must be between 0 and 100');
  if (luck < 0 || luck > 100) errors.push('Luck must be between 0 and 100');

  return { valid: errors.length === 0, errors };
}

// Demo items for testing (pre-deployed on testnet)
export const DEMO_CONTRACT_ITEMS: Item[] = [
  {
    id: 'demo-item-1',
    name: 'Dragon Slayer Sword',
    description: 'A legendary blade forged in dragon fire.',
    rarity: 4,
    stats: { attack: 85, defense: 20, speed: 15, luck: 10 },
    metadata_uri: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    image_url: '/items/dragon-sword.png',
    studio_id: 'studio-dragon-quest',
    owner: '0xdemo123456789',
    minted_at: 1700000000,
    power_score: 130,
  },
  {
    id: 'demo-item-2',
    name: 'Crystal Guardian Shield',
    description: 'A shield made of pure crystal that refracts attacks.',
    rarity: 3,
    stats: { attack: 10, defense: 90, speed: 5, luck: 25 },
    metadata_uri: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    image_url: '/items/crystal-shield.png',
    studio_id: 'studio-crystal',
    owner: '0xdemo123456789',
    minted_at: 1700001000,
    power_score: 130,
  },
  {
    id: 'demo-item-3',
    name: 'Phantom Knight Armor',
    description: 'Lightweight armor woven from ethereal essence.',
    rarity: 4,
    stats: { attack: 30, defense: 70, speed: 50, luck: 15 },
    metadata_uri: 'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654',
    image_url: '/items/phantom-armor.png',
    studio_id: 'studio-phantom',
    owner: '0xdemo123456789',
    minted_at: 1700002000,
    power_score: 165,
  },
  {
    id: 'demo-item-4',
    name: 'Arcane Master Staff',
    description: 'A staff imbued with ancient arcane power.',
    rarity: 3,
    stats: { attack: 60, defense: 40, speed: 45, luck: 35 },
    metadata_uri: '0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    image_url: '/items/arcane-staff.png',
    studio_id: 'studio-arcane',
    owner: '0xdemo123456789',
    minted_at: 1700003000,
    power_score: 180,
  },
  {
    id: 'demo-item-5',
    name: 'Thunder God Axe',
    description: 'An axe crackling with the power of lightning.',
    rarity: 4,
    stats: { attack: 95, defense: 25, speed: 35, luck: 20 },
    metadata_uri: '567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    image_url: '/items/thunder-axe.png',
    studio_id: 'studio-thunder',
    owner: '0xdemo123456789',
    minted_at: 1700004000,
    power_score: 175,
  },
  {
    id: 'demo-item-6',
    name: 'Shadow Dagger',
    description: 'A dagger that cuts through shadows.',
    rarity: 2,
    stats: { attack: 45, defense: 10, speed: 60, luck: 20 },
    metadata_uri: 'demo-blob-6',
    image_url: '/items/shadow-dagger.png',
    studio_id: 'studio-shadow',
    owner: '0xdemo123456789',
    minted_at: 1700005000,
    power_score: 135,
  },
];

// Get all demo items
export function getDemoItems(): Item[] {
  return DEMO_CONTRACT_ITEMS;
}

// Get item by ID
export function getItemById(id: string): Item | undefined {
  return DEMO_CONTRACT_ITEMS.find(item => item.id === id);
}

// Get items by rarity
export function getItemsByRarity(rarity: number): Item[] {
  return DEMO_CONTRACT_ITEMS.filter(item => item.rarity === rarity);
}

// Get items by owner
export function getItemsByOwner(owner: string): Item[] {
  return DEMO_CONTRACT_ITEMS.filter(item => item.owner === owner);
}

// Get all unique studios
export function getAllStudios(): string[] {
  const studios = new Set(DEMO_CONTRACT_ITEMS.map(item => item.studio_id));
  return Array.from(studios);
}

// Studio data
export const DEMO_STUDIOS: Studio[] = [
  {
    id: 'studio-dragon-quest',
    name: 'Dragon Quest Studios',
    owner: '0xowner123',
    whitelisted_items: ['demo-item-1'],
    is_active: true,
    created_at: 1699000000,
  },
  {
    id: 'studio-crystal',
    name: 'Crystal Gaming',
    owner: '0xowner456',
    whitelisted_items: ['demo-item-2'],
    is_active: true,
    created_at: 1699000100,
  },
  {
    id: 'studio-phantom',
    name: 'Phantom Interactive',
    owner: '0xowner789',
    whitelisted_items: ['demo-item-3'],
    is_active: true,
    created_at: 1699000200,
  },
];