# Sui Gear Vault

🏆 **Tatum x Sui x Walrus Hackathon Submission**

Cross-game inventory system where game items are Sui NFTs with metadata/images stored on Walrus decentralized storage.

## Features

- 🎮 **Cross-Game Inventory**: Own your items across games, trade freely
- 📦 **Walrus Integration**: Item metadata stored on decentralized Walrus storage
- ⛓️ **Sui Blockchain**: True ownership with NFT technology
- 🚀 **Tatum RPC**: Powered by enterprise-grade blockchain infrastructure
- 💨 **Live Demo**: Real-time Walrus retrieval with latency display

## Tech Stack

- **Frontend**: Next.js 14.2.5 + TypeScript
- **Styling**: Tailwind CSS (dark gaming theme)
- **Blockchain**: Sui Move (smart contracts)
- **Storage**: Walrus decentralized storage
- **RPC**: Tatum SDK for Sui
- **Deployment**: Vercel

## Pages

- `/` - Landing page with hero and demo items
- `/browse` - Browse all available items with filters
- `/inventory` - Player inventory (wallet required)
- `/visualizer` - Live demo of Walrus storage retrieval

## Hackathon Criteria Alignment

| Criteria | Implementation |
|----------|---------------|
| **Walrus Integration (30%)** | ✅ Architectural - metadata/images stored on Walrus, not decorative |
| **Tatum Integration (30%)**** | ✅ RPC calls for Sui blockchain interactions |
| **Technical Quality (20%)** | ✅ Clean TypeScript, Next.js best practices |
| **UI/UX (20%)** | ✅ Dark gaming theme, responsive, polished demo |

## Prize Structure

- 🥇 1st Place: $600
- 🥈 2nd Place: $400
- 🥉 3rd Place: $300
- 4th/5th: $200/$100
- 🌟 Best Walrus Integration: +$200 (stackable!)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Smart Contracts

Located in `/contracts/sources/`:
- `item_registry.move` - Core item tracking
- `studio_manager.move` - Game studio management
- `nft_minting.move` - NFT creation and transfers

## Environment Variables

```env
NEXT_PUBLIC_TATUM_API_KEY=your_tatum_api_key
NEXT_PUBLIC_SUI_NETWORK=testnet  # or mainnet
```

## Timeline

- **Hackathon**: May 23 - June 6, 2026
- **Deadline**: June 6, 17:00 UTC
- **Results**: June 7

## Links

- [Tatum Documentation](https://docs.tatum.io)
- [Walrus Documentation](https://docs.wal.app)
- [Sui Documentation](https://docs.sui.io)
- [Discord Community](https://discord.gg/Ttp9zJwPqa)

---

Built with ❤️ for the Tatum x Sui x Walrus Hackathon