import { useState } from 'react';
import { Users, Play, Crown, Copy, Check, Zap, Timer, UserPlus } from 'lucide-react';
import { Loading } from './Loading';
import { useAuth } from '../hooks/useAuth';

interface Player {
  id: string;
  name: string;
  finished?: boolean;
  isReady?: boolean;
}

interface Race {
  id?: string;
  players: Player[];
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  countdown?: number;
}

interface RaceLobbyProps {
  race: Race | null;
  onJoinRace: (name: string) => void;
  onLeaveRace: () => void;
  connected: boolean;
}

export function RaceLobby({ race, onJoinRace, onLeaveRace, connected }: RaceLobbyProps) {
  const { user } = useAuth();
  const [playerName, setPlayerName] = useState(user?.username || '');
  const [copied, setCopied] = useState(false);

  const copyRoomLink = () => {
    if (race?.id) {
      navigator.clipboard.writeText(`${window.location.origin}/race?room=${race.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!connected) {
    return (
      <Loading variant="fullscreen" text="Connecting to race server..." />
    );
  }

  if (!race) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-linear-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quick Race</h2>
            <p className="text-gray-400">Join the global matchmaking queue</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="block text-sm text-gray-400 mb-2">Display Name</h4>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                maxLength={20}
              />
            </div>
            
            <button
              onClick={() => playerName.trim() && onJoinRace(playerName.trim())}
              disabled={!playerName.trim()}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Find Match
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Tips</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-start gap-2">
                <Timer className="w-4 h-4 mt-0.5 text-blue-400" />
                Races start when 2+ players are ready
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-4 h-4 mt-0.5 text-purple-400" />
                Invite friends for private matches
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-linear-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Race Lobby</h2>
            <p className="text-sm text-gray-400">
              {race.status === 'waiting' ? 'Waiting for players...' : 'Race starting soon!'}
            </p>
          </div>
          <div className="flex gap-2">
            {race.id && (
              <button
                onClick={copyRoomLink}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            )}
            <button
              onClick={onLeaveRace}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
            >
              Leave
            </button>
          </div>
        </div>

        {/* Players List */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Players ({race.players.length}/8)
          </h3>
          <div className="grid gap-2">
            {race.players.map((player: Player, index: number) => (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  index === 0 
                    ? 'bg-linear-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/30' 
                    : 'bg-gray-700/30 border border-gray-700/50 hover:border-gray-600/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 
                      ? 'bg-linear-to-br from-yellow-400 to-amber-500 text-black' 
                      : 'bg-linear-to-br from-purple-500 to-pink-500 text-white'
                  }`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{player.name}</span>
                  {index === 0 && <Crown className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="flex items-center gap-2">
                  {player.isReady && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Ready</span>
                  )}
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 2 - race.players.length) }).map((_, i) => (
              <div 
                key={`empty-${i}`} 
                className="flex items-center gap-3 p-3 bg-gray-800/30 border border-dashed border-gray-700/50 rounded-xl"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-gray-500">Waiting for player...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        {race.status === 'countdown' && race.countdown && (
          <div className="text-center py-8 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30">
            <div className="text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 mb-2">
              {race.countdown}
            </div>
            <p className="text-gray-400">Get ready to type!</p>
          </div>
        )}

        {race.status === 'waiting' && (
          <div className="text-center py-8">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="relative w-full h-full rounded-full bg-gray-700/50 flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-400 mb-2">Waiting for more players...</p>
            <p className="text-sm text-gray-500">Need at least 2 players to start</p>
          </div>
        )}
      </div>
    </div>
  );
}
