'use client';

import { useState, useEffect } from 'react';
import { Box, Zap, Globe, Database, ChevronDown, Wallet, LogOut, Copy, Check } from 'lucide-react';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<{ block: number; network: string } | null>(null);

  // Check for stored address on mount
  useEffect(() => {
    const stored = localStorage.getItem('sui_wallet_address');
    if (stored) {
      setAddress(stored);
      setIsConnected(true);
      fetchNetworkInfo();
    }
  }, []);

  const fetchNetworkInfo = async () => {
    try {
      const response = await fetch('/api/walrus/retrieve?blobId=demo-item-1');
      setNetworkInfo({
        block: Math.floor(Math.random() * 1000000) + 50000000,
        network: 'Sui Mainnet'
      });
    } catch (e) {
      setNetworkInfo({ block: 0, network: 'mainnet' });
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate demo address (in production, use Sui wallet)
      const demoAddress = '0x' + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setAddress(demoAddress);
      setIsConnected(true);
      setIsConnecting(false);
      
      localStorage.setItem('sui_wallet_address', demoAddress);
      
      fetchNetworkInfo();
      
      if (onConnect) {
        onConnect(demoAddress);
      }
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setShowDropdown(false);
    setNetworkInfo(null);
    localStorage.removeItem('sui_wallet_address');
    
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 hover:border-purple-500/50 transition-all"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-sm text-gray-300">{formatAddress(address)}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-64 p-4 rounded-lg bg-gray-900/95 border border-purple-500/30 backdrop-blur-sm z-50">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Connected Wallet</span>
            </div>
            
            <div className="p-3 rounded-lg bg-gray-800/50 mb-4">
              <div className="font-mono text-sm text-purple-300 break-all">{address}</div>
            </div>
            
            {/* Network Info */}
            {networkInfo && (
              <div className="p-3 rounded-lg bg-cyan-600/10 border border-cyan-500/20 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-semibold">{networkInfo.network}</span>
                </div>
                <div className="text-xs text-gray-400">
                  Block: #{networkInfo.block.toLocaleString()}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={copyAddress}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              
              <button
                onClick={handleDisconnect}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium transition-all disabled:opacity-50"
    >
      {isConnecting ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </>
      )}
    </button>
  );
}