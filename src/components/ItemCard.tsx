'use client';

import { Item, RARITY_NAMES, RARITY_COLORS } from '@/lib/types';
import { Sword, Shield, Zap, Sparkles } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onClick?: (item: Item) => void;
  selected?: boolean;
}

export default function ItemCard({ item, onClick, selected }: ItemCardProps) {
  const rarityColor = RARITY_COLORS[item.rarity];
  const rarityName = RARITY_NAMES[item.rarity];
  const powerScore = item.power_score || (item.stats.attack + item.stats.defense + item.stats.speed + item.stats.luck);

  return (
    <div
      onClick={() => onClick?.(item)}
      className={`
        relative p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 
        border transition-all duration-300 cursor-pointer
        ${selected ? 'ring-2 ring-purple-500' : ''}
      `}
      style={{ 
        borderColor: `${rarityColor}40`,
        boxShadow: selected ? `0 0 20px ${rarityColor}40` : `0 0 10px ${rarityColor}20`
      }}
    >
      {/* Rarity indicator */}
      <div 
        className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold"
        style={{ 
          backgroundColor: `${rarityColor}20`,
          color: rarityColor,
          border: `1px solid ${rarityColor}40`
        }}
      >
        {rarityName}
      </div>

      {/* Item icon placeholder */}
      <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-gray-800/50 flex items-center justify-center">
        <Sword className="w-10 h-10" style={{ color: rarityColor }} />
      </div>

      {/* Item name */}
      <h3 className="text-lg font-bold text-white mb-2 text-center truncate">
        {item.name}
      </h3>

      {/* Power score */}
      <div className="text-center mb-4">
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          {powerScore}
        </span>
        <span className="text-xs text-gray-500 ml-1">Power</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatBadge icon={<Sword className="w-3 h-3" />} label="ATK" value={item.stats.attack} color="red" />
        <StatBadge icon={<Shield className="w-3 h-3" />} label="DEF" value={item.stats.defense} color="blue" />
        <StatBadge icon={<Zap className="w-3 h-3" />} label="SPD" value={item.stats.speed} color="yellow" />
        <StatBadge icon={<Sparkles className="w-3 h-3" />} label="LCK" value={item.stats.luck} color="green" />
      </div>

      {/* Walrus indicator */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Stored on Walrus</span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at center, ${rarityColor}10, transparent 70%)`
        }}
      />
    </div>
  );
}

function StatBadge({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  color: string;
}) {
  const colorMap: Record<string, string> = {
    red: 'text-red-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
  };

  return (
    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-800/30">
      <span className={colorMap[color]}>{icon}</span>
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-sm font-bold ${colorMap[color]}`}>{value}</span>
    </div>
  );
}