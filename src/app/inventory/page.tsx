'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Box, Wallet, ArrowLeft, Sword, Shield, Zap, Sparkles,
  Send, Trash2, ChevronRight, Plus, Lock
} from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import ItemVisualizer from '@/components/ItemVisualizer';
import WalletConnect from '@/components/WalletConnect';
import { Item, RARITY_NAMES, RARITY_COLORS } from '@/lib/types';
import { getDemoItems } from '@/lib/contracts';

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showTransferModal, setShowTransferModal] = useState<Item | null>(null);

  useEffect(() => {
    // Load demo items
    setItems(getDemoItems());
  }, []);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
  };

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
              <Link href="/inventory" className="text-white font-medium">Inventory</Link>
              <Link href="/visualizer" className="text-gray-400 hover:text-white transition-colors">Visualizer</Link>
              <WalletConnect 
                onConnect={handleWalletConnect}
                onDisconnect={handleWalletDisconnect}
              />
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
              <h1 className="text-3xl font-bold text-white">Your Inventory</h1>
              <p className="text-gray-400 mt-1">Manage your gear collection</p>
            </div>
          </div>

          {/* Wallet Status */}
          {!walletAddress && (
            <div className="p-6 rounded-xl bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Connect Your Wallet</h3>
                  <p className="text-gray-400 text-sm">Connect your Sui wallet to view your inventory and manage your gear</p>
                </div>
                <WalletConnect 
                  onConnect={handleWalletConnect}
                  onDisconnect={handleWalletDisconnect}
                />
              </div>
            </div>
          )}

          {walletAddress && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50 mb-8">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">Connected Wallet</div>
                <div className="font-mono text-purple-400">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{items.length}</div>
                <div className="text-xs text-gray-500">Items</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {walletAddress ? (
            <>
              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                      <Sword className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {items.reduce((sum, item) => sum + item.stats.attack, 0)}
                      </div>
                      <div className="text-xs text-gray-500">Total Attack</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {items.reduce((sum, item) => sum + item.stats.defense, 0)}
                      </div>
                      <div className="text-xs text-gray-500">Total Defense</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {items.reduce((sum, item) => sum + item.stats.speed, 0)}
                      </div>
                      <div className="text-xs text-gray-500">Total Speed</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {items.reduce((sum, item) => sum + item.stats.luck, 0)}
                      </div>
                      <div className="text-xs text-gray-500">Total Luck</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="relative">
                    <ItemCard
                      item={item}
                      onClick={setSelectedItem}
                      selected={selectedItem?.id === item.id}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTransferModal(item);
                        }}
                        className="p-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 transition-colors"
                        title="Transfer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {items.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <Box className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No items yet</h3>
                  <p className="text-gray-500 mb-6">Start building your collection by minting new gear</p>
                  <Link 
                    href="/browse"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold"
                  >
                    Browse Items
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                <Lock className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Wallet not connected</h3>
              <p className="text-gray-500">Connect your wallet to view your inventory</p>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal 
          item={showTransferModal} 
          onClose={() => setShowTransferModal(null)} 
        />
      )}

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

function TransferModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const [recipient, setRecipient] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTransfer = async () => {
    if (!recipient.startsWith('0x') || recipient.length !== 66) {
      alert('Please enter a valid Sui address');
      return;
    }
    
    setIsTransferring(true);
    // Simulate transfer
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTransferring(false);
    setSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-gray-900/95 border border-purple-500/30 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Transfer Item</h2>
        
        <div className="p-4 rounded-xl bg-gray-800/50 mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: `${RARITY_COLORS[item.rarity]}20`,
                border: `2px solid ${RARITY_COLORS[item.rarity]}40`
              }}
            >
              <Sword className="w-6 h-6" style={{ color: RARITY_COLORS[item.rarity] }} />
            </div>
            <div>
              <div className="font-semibold text-white">{item.name}</div>
              <div 
                className="text-sm"
                style={{ color: RARITY_COLORS[item.rarity] }}
              >
                {RARITY_NAMES[item.rarity]}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 font-mono"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={isTransferring || success}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium transition-colors disabled:opacity-50"
          >
            {success ? 'Transferred!' : isTransferring ? 'Transferring...' : 'Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
}