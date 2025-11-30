import { useState } from 'react';
import { Users, Play, Crown } from 'lucide-react';

interface RaceLobbyProps {
  race: any;
  onJoinRace: (name: string) => void;
  onLeaveRace: () => void;
  connected: boolean;
}

export function RaceLobby({ race, onJoinRace, onLeaveRace, connected }: RaceLobbyProps) {
  const [playerName, setPlayerName] = useState('');

  if (!connected) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Connecting to race server...</p>
      </div>
    );
  }

  if (!race) {
    return (
      <div className="max-w-md mx-auto bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="text-center mb-6">
          <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Join Multiplayer Race</h2>
          <p className="text-gray-400">Enter your name to join or create a race</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            maxLength={20}
          />
          <button
            onClick={() => playerName.trim() && onJoinRace(playerName.trim())}
            disabled={!playerName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Join Race
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Race Lobby</h2>
        <button
          onClick={onLeaveRace}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Leave Race
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Players ({race.players.length})
        </h3>
        <div className="grid gap-2">
          {race.players.map((player: any, index: number) => (
            <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
              {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
              <span className="font-medium">{player.name}</span>
              {player.finished && <span className="text-green-500 text-sm">Finished</span>}
            </div>
          ))}
        </div>
      </div>

      {race.status === 'countdown' && (
        <div className="text-center py-8">
          <div className="text-6xl font-bold text-blue-500 mb-2">{race.countdown}</div>
          <p className="text-gray-400">Race starting...</p>
        </div>
      )}

      {race.status === 'waiting' && (
        <div className="text-center py-8">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Waiting for more players...</p>
        </div>
      )}
    </div>
  );
}
