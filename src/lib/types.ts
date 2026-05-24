// Item types
export interface ItemStats {
  attack: number;
  defense: number;
  speed: number;
  luck: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: 1 | 2 | 3 | 4; // Common, Rare, Epic, Legendary
  stats: ItemStats;
  metadata_uri: string; // Walrus blob ID
  image_url: string;
  studio_id: string;
  owner: string;
  minted_at: number;
  power_score?: number;
}

export interface ItemMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    attack: number;
    defense: number;
    speed: number;
    luck: number;
  };
  rarity: number;
  game_compatible: string[];
  created_at: number;
}

// Studio types
export interface Studio {
  id: string;
  name: string;
  owner: string;
  whitelisted_items: string[];
  is_active: boolean;
  created_at: number;
}

// Wallet types
export interface WalletState {
  address: string | null;
  connected: boolean;
  connecting: boolean;
}

// Walrus types
export interface WalrusUploadResult {
  blobId: string;
  timestamp: number;
}

export interface WalrusRetrievalResult {
  data: any;
  latency: number; // in ms
  blobId: string;
}

// Rarity enum mapping
export const RARITY_NAMES: Record<number, string> = {
  1: 'Common',
  2: 'Rare',
  3: 'Epic',
  4: 'Legendary',
};

export const RARITY_COLORS: Record<number, string> = {
  1: '#94a3b8', // silver
  2: '#06b6d4', // cyan
  3: '#8b5cf6', // purple
  4: '#fbbf24', // gold
};

// Network types
export type Network = 'mainnet' | 'testnet';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}