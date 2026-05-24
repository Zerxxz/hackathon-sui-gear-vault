'use client';

import { useState, useEffect } from 'react';
import { Item, RARITY_NAMES, RARITY_COLORS } from '@/lib/types';
import { retrieveFromWalrus } from '@/lib/walrus';
import { 
  Sword, Shield, Zap, Sparkles, Clock, Database, X, ChevronRight, ExternalLink, Copy, Check 
} from 'lucide-react';

interface ItemVisualizerProps {
  item: Item;
  onClose?: () => void;
}

export default function ItemVisualizer({ item, onClose }: ItemVisualizerProps) {
  const [metadata, setMetadata] = useState<any>(null);
  const [retrievalTime, setRetrievalTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadFromWalrus();
  }, [item.metadata_uri]);

  const loadFromWalrus = async () => {
    setLoading(true);
    const start = performance.now();
    
    try {
      const result = await retrieveFromWalrus(item.metadata_uri);
      setRetrievalTime(result.latency);
      setMetadata(result.data);
    } catch (error) {
      console.error('Error loading from Walrus:', error);
    } finally {
      setLoading(false);
    }
  };

  const rarityColor = RARITY_COLORS[item.rarity];
  const rarityName = RARITY_NAMES[item.rarity];
  const powerScore = item.power_score || (
    item.stats.attack + item.stats.defense + item.stats.speed + item.stats.luck
  );

  const copyBlobId = () => {
    navigator.clipboard.writeText(item.metadata_uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ 
          background: `radial-gradient(circle at center, ${rarityColor}30, transparent 70%)`
        }}
      />

      {/* Main card */}
      <div 
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(20,20,30,0.95) 100%)',
          border: `2px solid ${rarityColor}60`,
          boxShadow: `0 0 50px ${rarityColor}30`
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Header */}
        <div className="relative p-6 pb-4" style={{ borderBottom: `1px solid ${rarityColor}30` }}>
          <div className="flex items-center gap-4">
            {/* Item icon */}
            <div 
              className="w-24 h-24 rounded-xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${rarityColor}20, ${rarityColor}05)`,
                border: `2px solid ${rarityColor}40`
              }}
            >
              <Sword className="w-14 h-14" style={{ color: rarityColor }} />
            </div>

            {/* Item info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{item.name}</h2>
              <div className="flex items-center gap-3">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ 
                    backgroundColor: `${rarityColor}30`,
                    color: rarityColor,
                    border: `1px solid ${rarityColor}50`
                  }}
                >
                  {rarityName}
                </span>
                <span className="text-gray-500 text-sm">ID: {item.id.slice(0, 8)}...</span>
              </div>
            </div>

            {/* Power score */}
            <div className="text-center">
              <div 
                className="text-4xl font-bold"
                style={{ color: rarityColor }}
              >
                {powerScore}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Power</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6">
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {item.description || metadata?.description || 'A legendary item stored on Walrus decentralized storage.'}
          </p>

          {/* Stats section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatBar 
                icon={<Sword className="w-4 h-4" />} 
                label="Attack" 
                value={item.stats.attack} 
                max={100} 
                color="#ef4444" 
              />
              <StatBar 
                icon={<Shield className="w-4 h-4" />} 
                label="Defense" 
                value={item.stats.defense} 
                max={100} 
                color="#3b82f6" 
              />
              <StatBar 
                icon={<Zap className="w-4 h-4" />} 
                label="Speed" 
                value={item.stats.speed} 
                max={100} 
                color="#eab308" 
              />
              <StatBar 
                icon={<Sparkles className="w-4 h-4" />} 
                label="Luck" 
                value={item.stats.luck} 
                max={100} 
                color="#22c55e" 
              />
            </div>
          </div>

          {/* Walrus retrieval section */}
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-cyan-400">Walrus Storage</span>
              </div>
              {loading ? (
                <div className="flex items-center gap-2 text-cyan-400">
                  <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                  <span className="text-sm">Retrieving...</span>
                </div>
              ) : retrievalTime !== null && (
                <div className="flex items-center gap-2 text-cyan-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-mono">{retrievalTime.toFixed(2)}ms</span>
                </div>
              )}
            </div>

            {/* Blob ID */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/50 mb-3">
              <span className="text-xs text-gray-500 flex-shrink-0">Blob ID:</span>
              <code className="text-sm text-cyan-300 flex-1 truncate font-mono">{item.metadata_uri}</code>
              <button
                onClick={copyBlobId}
                className="p-1 rounded hover:bg-gray-800/50 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>

            {/* Success indicator */}
            {retrievalTime !== null && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-gray-400">
                  Successfully retrieved from Walrus in{' '}
                  <span className="text-green-400 font-mono">{retrievalTime.toFixed(2)}ms</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-xs text-gray-500">
            Minted: {new Date(item.minted_at * 1000).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Studio:</span>
            <span className="text-sm text-purple-400">{item.studio_id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({ 
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2" style={{ color }}>
          {icon}
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span className="text-lg font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}