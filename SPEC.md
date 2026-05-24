# Sui Gear Vault - Technical Specification

## Project Overview
**Project Name:** Sui Gear Vault  
**Type:** Cross-game inventory system / Web3 dApp  
**Hackathon:** Tatum x Sui x Walrus  
**Core Functionality:** Decentralized inventory system where game items are Sui NFTs with metadata/images stored on Walrus, enabling cross-game item ownership and trading.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │ Item Browse │  │ Inventory   │  │ Item        │  │ Wallet     │ │
│  │ Page        │  │ View        │  │ Visualizer  │  │ Connect    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Tatum SDK      │   │  Walrus SDK     │   │  Sui Move       │
│  (Sui RPC)      │   │  (Storage)      │   │  (Contracts)    │
└─────────────────┘   └─────────────────┘   └─────────────────┘
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   SUI BLOCKCHAIN       │
                    │   (Mainnet/Testnet)    │
                    └───────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14.2.5 + TypeScript | UI/UX |
| State | React Context + Zustand | Local state management |
| Blockchain RPC | Tatum SDK (@tatumio/sdk) | Sui network calls |
| Storage | Walrus SDK | Decentralized metadata/images |
| Smart Contracts | Sui Move | NFT minting, registry, whitelisting |
| Styling | Tailwind CSS | Dark gaming theme |
| Wallet | Sui Wallet + Tatum | Wallet connection |

## Smart Contract Architecture

### Contract: `gear_vault` (Package ID: TBD after deployment)

#### Main Modules:

**1. item_registry** - Core item tracking
```
- Item struct (id, name, rarity, stats, metadata_uri, studio_id)
- Registry struct (items map, item_counter)
- Functions: create_item(), update_item(), get_item(), list_items_by_owner()
```

**2. studio_manager** - Game studio management
```
- Studio struct (id, name, whitelisted_items, is_active)
- Functions: create_studio(), whitelist_item(), revoke_whitelist(), is_studio_active()
```

**3. nft_minting** - NFT creation and transfers
```
- GearNFT struct (inherits Item, adds token_id, owner)
- Functions: mint_item(), transfer_item(), burn_item()
```

### Key Data Structures:

```move
struct Item has key, store {
    id: UID,
    name: String,
    rarity: u8,        // 1=Common, 2=Rare, 3=Epic, 4=Legendary
    stats: ItemStats,
    metadata_uri: String,  // Walrus blob ID
    studio_id: ID,
    created_at: u64,
}

struct ItemStats has store, drop {
    attack: u32,
    defense: u32,
    speed: u32,
    luck: u32,
}

struct Studio has key, store {
    id: UID,
    name: String,
    whitelisted_items: vector<ID>,
    is_active: bool,
}
```

## Walrus Integration Architecture

### Storage Strategy (Architectural, Not Decorative)

**Critical Integration Points:**

1. **Item Metadata Storage**
   - Upload item JSON metadata to Walrus
   - Store blob ID on-chain in NFT metadata_uri field
   - On-chain = immutable reference, Walrus = mutable content

2. **Item Image Storage**
   - Upload item images to Walrus with unique blob IDs
   - Reference in metadata JSON
   - Support for animated sprites (future)

3. **Metadata JSON Schema:**
```json
{
    "name": "Dragon Slayer Sword",
    "description": "A legendary blade forged in dragon fire",
    "image": "walrus://blob_id",
    "attributes": {
        "attack": 85,
        "defense": 20,
        "speed": 15,
        "luck": 10
    },
    "rarity": 4,
    "game_compatible": ["game_a", "game_b"],
    "created_at": 1700000000
}
```

4. **Retrieval Flow:**
   - Fetch NFT from Sui (get metadata_uri)
   - Use Walrus SDK to retrieve actual metadata/image
   - Display with timing metrics

## Frontend Architecture

### Pages:

**1. `/` - Landing/Demo Page**
- Hero section with project intro
- Live demo: click item → load from Walrus → display + timing

**2. `/browse` - Item Browser**
- Grid of all available items
- Filter by rarity, studio, stats
- Click to view details

**3. `/inventory` - Player Inventory**
- Connected wallet's items
- Equip/unequip UI
- Transfer functionality

**4. `/visualizer` - Item Visualizer Demo**
- Full-screen item display
- Animated stats
- Walrus retrieval timer
- Provenance chain

### Components:

- `WalletConnect` - Tatum wallet integration
- `ItemCard` - Display item with stats, rarity border
- `ItemVisualizer` - Full item view with animations
- `StatBar` - Animated stat display
- `RarityBadge` - Color-coded rarity indicator
- `WalrusTimer` - Retrieval latency display
- `InventoryGrid` - Draggable item grid

## API Integration

### Tatum SDK Integration:

```typescript
// Sui RPC Configuration
const tatumConfig = {
    network: 'sui',
    apiKey: process.env.NEXT_PUBLIC_TATUM_API_KEY,
    rpcUrl: 'https://sui-rpc-mainnet.tatum.io' // or testnet
};

// Wallet connection
const { wallet, connect } = useTatumWallet();

// NFT operations
- getNFTMetadata(objectId)
- getNFTsByOwner(address)
- transferNFT(to, objectId)

// Custom contract calls via Tatum's executeKMS or custom RPC
```

### Walrus SDK Integration:

```typescript
// Store metadata
const blobId = await walrus.store(JSON.stringify(metadata));

// Retrieve metadata  
const start = performance.now();
const data = await walrus.retrieve(blobId);
const latency = performance.now() - start;

// Display timing + data
```

## Environment Variables

```env
NEXT_PUBLIC_TATUM_API_KEY=your_tatum_api_key
NEXT_PUBLIC_SUI_NETWORK=testnet  # or mainnet
WALRUS_DEVELOPER_KEY=your_walrus_key
```

## Deployment Flow

1. **Local Development:** Next.js on port 3000
2. **Smart Contract:** Deploy to Sui testnet first
3. **GitHub:** Push to Zerxxz/hackathon-sui-gear-vault
4. **Vercel:** Deploy from GitHub repo

## MVP Checklist

- [x] SPEC.md created
- [ ] Sui Move smart contracts (item_registry, studio_manager, nft_minting)
- [ ] Next.js app setup with Tatum SDK
- [ ] Walrus SDK integration (architectural)
- [ ] Dark gaming UI theme
- [ ] Item browse page with cards
- [ ] Inventory view with wallet integration
- [ ] Item visualizer with Walrus retrieval timing
- [ ] Wallet connect functionality
- [ ] GitHub push
- [ ] Vercel deployment

## Success Metrics

1. Walrus retrieval < 2 seconds displayed live
2. NFT minting via Tatum SDK working
3. Cross-game item registry functional
4. Studio whitelisting operational
5. Dark gaming theme implemented
6. Live demo running on Vercel

## File Structure

```
hackathon-sui-gear-vault/
├── SPEC.md
├── contracts/
│   ├── Move.toml
│   └── sources/
│       ├── item_registry.move
│       ├── studio_manager.move
│       └── nft_minting.move
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── browse/
│   │   ├── inventory/
│   │   └── visualizer/
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── ItemCard.tsx
│   │   ├── ItemVisualizer.tsx
│   │   ├── StatBar.tsx
│   │   ├── RarityBadge.tsx
│   │   └── WalrusTimer.tsx
│   ├── lib/
│   │   ├── tatum.ts
│   │   ├── walrus.ts
│   │   ├── contracts.ts
│   │   └── types.ts
│   └── styles/
│       └── globals.css
├── public/
│   └── items/  # Sample item images
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Hackathon Scoring Alignment

- **30% Walrus Integration:** Used architecturally for metadata/image storage, not decorative
- **30% Tatum Integration:** Used for Sui RPC calls, wallet connection, NFT operations
- **20% Technical Quality:** TypeScript, Next.js best practices, clean architecture
- **20% UI/UX:** Dark gaming theme, responsive, polished demo

## Future Enhancements (Post-Hackathon)

1. Multi-chain support (Aptos, Solana)
2. Animated item sprites storage
3. Item trading marketplace
4. Game studio dashboard
5. Cross-chain item bridging