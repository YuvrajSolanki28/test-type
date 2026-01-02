import { RaceLobby } from './RaceLobby';
import { TypingArea } from './TypingArea';
import { useMultiplayerRace } from '../hooks/useMultiplayerRace';
import { Users } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  progress: number;
  wpm: number;
}

export function MultiplayerRace() {
  const {
    race,
    userInput,
    connected,
    joinRace,
    leaveRace,
    handleKeyPress,
    inputRef
  } = useMultiplayerRace();

  if (!race || race.status === 'waiting' || race.status === 'countdown') {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Friends Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => window.location.href = '/friends'}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Friends & Create Room
            </button>
          </div>

          <RaceLobby
            race={race}
            onJoinRace={joinRace}
            onLeaveRace={leaveRace}
            connected={connected}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Friends Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => window.location.href = '/friends'}
            className="px-4 py-2 bg-purple-500/80 hover:bg-purple-600 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <Users className="w-4 h-4" />
            Friends
          </button>
        </div>

        {/* Race Progress */}
        <div className="mb-8 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">Race Progress</h3>
          <div className="space-y-3">
            {race.players.map((player: Player) => (
              <div key={player.id} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium truncate">{player.name}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${player.progress}%` }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-400">{player.wpm} WPM</div>
              </div>
            ))}
          </div>
        </div>

        <TypingArea
          text={race.text}
          userInput={userInput}
          isComplete={race.status === 'finished'}
          isActive={race.status === 'racing'}
          progress={Math.round((userInput.length / race.text.length) * 100)}
          timeLimit={null}
          timeRemaining={null}
          onKeyPress={handleKeyPress}
          onReset={leaveRace}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}
