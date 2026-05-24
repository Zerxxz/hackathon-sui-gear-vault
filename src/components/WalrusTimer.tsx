'use client';

import { useEffect, useState } from 'react';
import { Database, Clock, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface WalrusTimerProps {
  blobId: string;
  onLatencyUpdate?: (latency: number) => void;
  autoStart?: boolean;
}

export default function WalrusTimer({ blobId, onLatencyUpdate, autoStart = true }: WalrusTimerProps) {
  const [status, setStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    if (autoStart && blobId) {
      measureLatency();
    }
  }, [blobId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === 'fetching' && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, startTime]);

  const measureLatency = async () => {
    setStatus('fetching');
    setStartTime(Date.now());
    setLatency(null);
    setElapsed(0);

    try {
      const response = await fetch(`/api/walrus/retrieve?blobId=${encodeURIComponent(blobId)}`);
      
      if (!response.ok) throw new Error('Fetch failed');
      
      const result = await response.json();
      const measuredLatency = result.latency || (startTime ? Date.now() - startTime : 0);
      
      setLatency(measuredLatency);
      setStatus('success');
      
      if (onLatencyUpdate) {
        onLatencyUpdate(measuredLatency);
      }
    } catch (error) {
      console.error('Walrus latency measurement failed:', error);
      setStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'fetching':
        return <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Database className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'fetching':
        return `Fetching... ${elapsed.toFixed(0)}ms`;
      case 'success':
        return 'Retrieved from Walrus';
      case 'error':
        return 'Fetch failed';
      default:
        return 'Idle';
    }
  };

  const getLatencyColor = () => {
    if (!latency) return 'text-gray-400';
    if (latency < 200) return 'text-green-400';
    if (latency < 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(6,182,212,0.2)' }}
          >
            {getStatusIcon()}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Walrus Retrieval</div>
            <div className="text-xs text-gray-500">{getStatusText()}</div>
          </div>
        </div>

        {latency !== null && (
          <div className="text-right">
            <div className={`text-2xl font-bold font-mono ${getLatencyColor()}`}>
              {latency.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">milliseconds</div>
          </div>
        )}
      </div>

      {/* Latency bar visualization */}
      {status === 'fetching' && (
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
            style={{ width: `${Math.min((elapsed / 2000) * 100, 100)}%` }}
          />
        </div>
      )}

      {/* Success checkmark */}
      {status === 'success' && latency && (
        <div className="flex items-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">
            Data retrieved in{' '}
            <span className={`font-mono font-bold ${getLatencyColor()}`}>
              {latency.toFixed(2)}ms
            </span>
          </span>
        </div>
      )}

      {/* Error message */}
      {status === 'error' && (
        <div className="mt-3 p-2 rounded-lg bg-red-900/20 border border-red-800/30">
          <div className="text-xs text-red-400">
            Failed to retrieve from Walrus. Check network connection.
          </div>
        </div>
      )}
    </div>
  );
}