'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Grid, List, Sword, Shield, Zap, Sparkles, 
  ChevronRight, Box, ArrowLeft, SlidersHorizontal
} from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import ItemVisualizer from '@/components/ItemVisualizer';
import { Item, RARITY_NAMES, RARITY_COLORS } from '@/lib/types';
import { getDemoItems } from '@/lib/contracts';

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'power' | 'name' | 'rarity'>('power');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setItems(getDemoItems());
  }, []);

  useEffect(() => {
    let result = [...items];

    // Filter by search
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by rarity
    if (selectedRarity) {
      result = result.filter(item => item.rarity === selectedRarity);
    }

    // Sort
    switch (sortBy) {
      case 'power':
        result.sort((a, b) => (b.power_score || 200) - (a.power_score || 200));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rarity':
        result.sort((a, b) => b.rarity - a.rarity);
        break;
    }

    setFilteredItems(result);
  }, [items, searchQuery, selectedRarity, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                <Box className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Sui Gear Vault</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/browse" className="text-white font-medium">Browse</Link>
              <Link href="/inventory" className="text-gray-400 hover:text-white transition-colors">Inventory</Link>
              <Link href="/visualizer" className="text-gray-400 hover:text-white transition-colors">Visualizer</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-8 px-6 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/"
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Browse Items</h1>
              <p className="text-gray-400 mt-1">Explore all gear available in the vault</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Rarity Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedRarity || ''}
                onChange={(e) => setSelectedRarity(e.target.value ? Number(e.target.value) : null)}
                className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="">All Rarities</option>
                <option value="1">Common</option>
                <option value="2">Rare</option>
                <option value="3">Epic</option>
                <option value="4">Legendary</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'power' | 'name' | 'rarity')}
                className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="power">Sort by Power</option>
                <option value="name">Sort by Name</option>
                <option value="rarity">Sort by Rarity</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-800/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredItems.length} of {items.length} items
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                <Sword className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={setSelectedItem}
                  selected={selectedItem?.id === item.id}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-purple-500/30 cursor-pointer transition-all"
                >
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${RARITY_COLORS[item.rarity]}20`,
                      border: `2px solid ${RARITY_COLORS[item.rarity]}40`
                    }}
                  >
                    <Sword className="w-8 h-8" style={{ color: RARITY_COLORS[item.rarity] }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ 
                          backgroundColor: `${RARITY_COLORS[item.rarity]}20`,
                          color: RARITY_COLORS[item.rarity]
                        }}
                      >
                        {RARITY_NAMES[item.rarity]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: RARITY_COLORS[item.rarity] }}>
                      {item.power_score || 0}
                    </div>
                    <div className="text-xs text-gray-500">Power</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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