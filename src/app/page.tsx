'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sword, Shield, Zap, Sparkles, ChevronRight, Database, 
  ArrowRight, Box, Users, Globe, Star, Play, Zap as Lightning
} from 'lucide-react';
import WalletConnect from '@/components/WalletConnect';
import ItemCard from '@/components/ItemCard';
import ItemVisualizer from '@/components/ItemVisualizer';
import { Item, RARITY_NAMES, RARITY_COLORS } from '@/lib/types';
import { getDemoItems } from '@/lib/contracts';

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState({ items: 0, studios: 0, games: 0 });

  useEffect(() => {
    // Load demo items
    setItems(getDemoItems());
    setStats({ items: 6, studios: 3, games: 12 });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                <Box className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Sui Gear Vault</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse</Link>
              <Link href="/inventory" className="text-gray-400 hover:text-white transition-colors">Inventory</Link>
              <Link href="/visualizer" className="text-gray-400 hover:text-white transition-colors">Visualizer</Link>
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 mb-6">
                <Lightning className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300">Tatum x Sui x Walrus Hackathon</span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">Mainnet</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Cross-Game
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Inventory System
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Store game items as Sui NFTs with metadata on Walrus decentralized storage. 
                Own your items across games, trade freely, and bring your gear anywhere.
              </p>

              <div className="flex items-center gap-4">
                <Link 
                  href="/visualizer"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold transition-all"
                >
                  <Play className="w-5 h-5" />
                  Try Demo
                </Link>
                <Link 
                  href="/browse"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 font-semibold transition-all"
                >
                  Browse Items
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-3xl blur-3xl" />
              <div className="relative p-8 rounded-2xl bg-gray-900/80 border border-purple-500/20">
                <div className="grid grid-cols-3 gap-4">
                  {items.slice(0, 3).map((item, i) => (
                    <div 
                      key={item.id}
                      className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/50 transition-all cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-gray-700/50 flex items-center justify-center">
                        <Sword className="w-8 h-8" style={{ color: RARITY_COLORS[item.rarity] }} />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white truncate">{item.name}</div>
                        <div 
                          className="text-xs mt-1"
                          style={{ color: RARITY_COLORS[item.rarity] }}
                        >
                          {RARITY_NAMES[item.rarity]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stats.items}</div>
              <div className="text-gray-400">Items Minted</div>
            </div>
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <div className="w-12 h-12 rounded-lg bg-cyan-600/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stats.studios}</div>
              <div className="text-gray-400">Game Studios</div>
            </div>
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stats.games}</div>
              <div className="text-gray-400">Compatible Games</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built for Gaming</h2>
            <p className="text-xl text-gray-400">Powered by leading Web3 infrastructure</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Database className="w-8 h-8" />}
              title="Walrus Storage"
              description="Item metadata and images stored on Walrus decentralized storage. Fast retrieval, permanent availability."
              color="cyan"
            />
            <FeatureCard
              icon={<Sword className="w-8 h-8" />}
              title="Sui NFT Items"
              description="True ownership on Sui blockchain. Trade, transfer, and use your items across any compatible game."
              color="purple"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Tatum RPC"
              description="Powered by Tatum's reliable RPC infrastructure for fast and secure blockchain interactions."
              color="gold"
            />
          </div>
        </div>
      </section>

      {/* Items Demo Section */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Demo Items</h2>
              <p className="text-gray-400">Click any item to load its metadata from Walrus and view detailed stats</p>
            </div>
            <Link 
              href="/browse"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              View All
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 6).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={setSelectedItem}
                selected={selectedItem?.id === item.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                <Box className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white">Sui Gear Vault</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Tatum x Sui x Walrus Hackathon</span>
              <span>•</span>
              <span>2024</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Item Visualizer Modal */}
      {selectedItem && (
        <ItemVisualizer 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
    gold: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 text-yellow-400',
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${colorMap[color]}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}