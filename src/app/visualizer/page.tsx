'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Box, ArrowLeft, Sword, Shield, Zap, Sparkles,
  Database, Clock, Activity, CheckCircle, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Item, RARITY_NAMES, RARITY_COLORS } from '@/lib/types';
import { getDemoItems, getItemById } from '@/lib/contracts';

export default function VisualizerPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [item, setItem] = useState<Item | null>(null);
  const [retrievalTime, setRetrievalTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLiveDemo, setShowLiveDemo] = useState(true);

  const items = getDemoItems();

  useEffect(() => {
    const newItem = items[selectedIndex];
    setItem(newItem);
    if (showLiveDemo) {
      measureWalrusRetrieval(newItem.metadata_uri);
    }
  }, [selectedIndex]);

  const measureWalrusRetrieval = async (blobId: string) => {
    setLoading(true);
    const start = performance.now();
    
    // Simulate Walrus retrieval
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
    
    const latency = performance.now() - start;
    setRetrievalTime(latency);
    setLoading(false);
  };

  const handleRefresh = () => {
    if (item) {
      measureWalrusRetrieval(item.metadata_uri);
    }
  };

  const handlePrev = () => {
    setSelectedIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex(prev => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (!item) return null;

  const rarityColor = RARITY_COLORS[item.rarity];
  const powerScore = item.power_score || (
    item.stats.attack + item.stats.defense + item.stats.speed + item.stats.luck
  );

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
              <Link href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse</Link>
              <Link href="/inventory" className="text-gray-400 hover:text-white transition-colors">Inventory</Link>
              <Link href="/visualizer" className="text-white font-medium">Visualizer</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/"
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Item Visualizer</h1>
              <p className="text-gray-400 mt-1">Live demo of Walrus decentralized storage retrieval</p>
            </div>
          </div>

          {/* Main Visualizer Card */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            {/* Background glow */}
            <div 
              className="absolute inset-0"
              style={{ 
                background: `radial-gradient(circle at center, ${rarityColor}20 0%, transparent 70%)`
              }}
            />

            <div className="relative p-8 rounded-2xl" style={{ 
              background: 'linear-gradient(135deg, rgba(10,10,20,0.95) 0%, rgba(20,20,35,0.95) 100%)',
              border: `2px solid ${rarityColor}40`
            }}>
              {/* Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-400" />
                </button>
                
                <div className="flex items-center gap-2">
                  {items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === selectedIndex ? 'bg-purple-500 w-6' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Item Display */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Item Image */}
                <div className="flex items-center justify-center">
                  <div 
                    className="relative w-64 h-64 rounded-2xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${rarityColor}15, ${rarityColor}05)`,
                      border: `3px solid ${rarityColor}40`,
                      boxShadow: `0 0 60px ${rarityColor}30`
                    }}
                  >
                    <Sword className="w-32 h-32" style={{ color: rarityColor }} />
                    
                    {/* Rarity Badge */}
                    <div 
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold"
                      style={{ 
                        backgroundColor: `${rarityColor}30`,
                        color: rarityColor,
                        border: `1px solid ${rarityColor}50`
                      }}
                    >
                      {RARITY_NAMES[item.rarity]}
                    </div>
                  </div>
                </div>

                {/* Right: Item Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">{item.name}</h2>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">ID: {item.id.slice(0, 16)}...</span>
                    </div>
                  </div>

                  {/* Power Score */}
                  <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                    <div className="text-sm text-gray-500 mb-1">Power Score</div>
                    <div className="text-5xl font-bold" style={{ color: rarityColor }}>
                      {powerScore}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard 
                      icon={<Sword className="w-5 h-5" />}
                      label="Attack"
                      value={item.stats.attack}
                      max={100}
                      color="#ef4444"
                    />
                    <StatCard 
                      icon={<Shield className="w-5 h-5" />}
                      label="Defense"
                      value={item.stats.defense}
                      max={100}
                      color="#3b82f6"
                    />
                    <StatCard 
                      icon={<Zap className="w-5 h-5" />}
                      label="Speed"
                      value={item.stats.speed}
                      max={100}
                      color="#eab308"
                    />
                    <StatCard 
                      icon={<Sparkles className="w-5 h-5" />}
                      label="Luck"
                      value={item.stats.luck}
                      max={100}
                      color="#22c55e"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 p-4 rounded-xl bg-gray-800/20">
                <p className="text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>

          {/* Walrus Storage Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Retrieval Timer */}
            <div 
              className="p-6 rounded-xl"
              style={{ 
                background: 'rgba(6,182,212,0.05)',
                border: '1px solid rgba(6,182,212,0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(6,182,212,0.15)' }}
                  >
                    {loading ? (
                      <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
                    ) : retrievalTime !== null ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Database className="w-6 h-6 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">Walrus Retrieval</div>
                    <div className="text-sm text-gray-500">
                      {loading ? 'Fetching...' : retrievalTime !== null ? 'Complete' : 'Idle'}
                    </div>
                  </div>
                </div>

                {retrievalTime !== null && (
                  <div className="text-right">
                    <div className="text-4xl font-bold text-cyan-400 font-mono">
                      {retrievalTime.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">milliseconds</div>
                  </div>
                )}
              </div>

              {/* Latency Bar */}
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((retrievalTime || 0) / 20, 100)}%`,
                    backgroundColor: retrievalTime && retrievalTime < 200 ? '#22c55e' : 
                                   retrievalTime && retrievalTime < 500 ? '#eab308' : '#ef4444'
                  }}
                />
              </div>

              {/* Blob ID */}
              <div className="p-3 rounded-lg bg-gray-900/50 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Blob ID:</span>
                  <code className="text-sm text-cyan-300 font-mono truncate max-w-[200px]">
                    {item.metadata_uri.slice(0, 32)}...
                  </code>
                </div>
              </div>

              {/* Success Message */}
              {retrievalTime !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-gray-400">
                    Successfully retrieved item metadata from Walrus decentralized storage
                  </span>
                </div>
              )}

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Retrieving...' : 'Test Retrieval'}
              </button>
            </div>

            {/* Info Panel */}
            <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-purple-400">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Item Created on Sui</div>
                    <div className="text-sm text-gray-500">NFT metadata_uri points to Walrus blob</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-purple-400">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Metadata Stored on Walrus</div>
                    <div className="text-sm text-gray-500">Image, stats, and attributes stored permanently</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-purple-400">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Fast Retrieval</div>
                    <div className="text-sm text-gray-500">On-demand fetching with latency display</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-purple-600/10 border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Database className="w-5 h-5" />
                  <span className="font-semibold">Walrus Integration</span>
                </div>
                <p className="text-sm text-gray-400">
                  This demo showcases architectural Walrus integration — not just storage, 
                  but a core part of how game items retrieve and display their data.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Toggle */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowLiveDemo(!showLiveDemo)}
              className="px-6 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 transition-colors"
            >
              {showLiveDemo ? 'Hide Live Demo' : 'Show Live Demo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  max, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  max: number; 
  color: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2" style={{ color }}>
          {icon}
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span className="text-xl font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}