'use client';

import { useState } from 'react';
import { Wallet, ChevronDown, LogOut, Copy, Check } from 'lucide-react';

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

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection
    // In production, this would use Tatum SDK or Sui wallet
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate demo address
    const demoAddress = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setAddress(demoAddress);
    setIsConnected(true);
    setIsConnecting(false);
    
    if (onConnect) {
      onConnect(demoAddress);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setShowDropdown(false);
    
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