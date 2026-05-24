# Sui Gear Vault

🏆 **Tatum x Sui x Walrus Hackathon Submission**

🔗 **Live Demo:** https://hackathon-sui-gear-vault.vercel.app

Cross-game inventory system where game items are Sui NFTs with metadata/images stored on Walrus decentralized storage.

## Features

- 🎮 **Cross-Game Inventory**: Own your items across games, trade freely
- 📦 **Walrus Integration**: Item metadata stored on decentralized Walrus storage (architectural, not decorative)
- ⛓️ **Sui Blockchain**: True ownership with NFT technology via Tatum RPC
- 🚀 **Tatum RPC**: Powered by enterprise-grade blockchain infrastructure
- 💨 **Live Demo**: Real-time Walrus retrieval with latency display
- 🌐 **Mainnet**: Running on Sui Mainnet

## Tech Stack

- **Frontend**: Next.js 14.2.5 + TypeScript
- **Styling**: Tailwind CSS (dark gaming theme)
- **Blockchain**: Sui Move (smart contracts)
- **Storage**: Walrus decentralized storage
- **RPC**: Tatum SDK for Sui Mainnet
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
| **Tatum Integration (30%)** | ✅ RPC calls for Sui blockchain interactions |
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
npm install
npm run dev
npm run build
```

## Smart Contracts

Located in `/contracts/sources/`:
- `item_registry.move` - Core item tracking
- `studio_manager.move` - Game studio management
- `nft_minting.move` - NFT creation and transfers

## Links

- [Tatum Documentation](https://docs.tatum.io)
- [Walrus Documentation](https://docs.wal.app)
- [Sui Documentation](https://docs.sui.io)
- [Discord Community](https://discord.gg/Ttp9zJwPqa)
- [Submit Project](https://docs.google.com/forms/d/e/1FAIpQLSdPaKcfTbS49ngThDE9Xap7_xkLFrQOISCPHGKJ3FL1drchTw/viewform)

---

Built with ❤️ for the Tatum x Sui x Walrus Hackathon