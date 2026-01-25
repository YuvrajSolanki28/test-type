import { RaceLobby } from './RaceLobby';
import { TypingArea } from './TypingArea';
import { useMultiplayerRace } from '../hooks/useMultiplayerRace';
import { useAuth } from '../hooks/useAuth';
import { Users, Trophy, Zap, Crown, Medal, Award, Wifi, WifiOff, LogIn, UserPlus } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  progress: number;
  wpm: number;
  finished?: boolean;
}

const getPositionIcon = (index: number) => {
  switch (index) {
    case 0: return <Crown className="w-4 h-4 text-yellow-400" />;
    case 1: return <Medal className="w-4 h-4 text-gray-300" />;
    case 2: return <Award className="w-4 h-4 text-amber-600" />;
    default: return <span className="w-4 h-4 text-gray-500 text-xs font-bold">{index + 1}</span>;
  }
};

const getProgressColor = (index: number) => {
  const colors = [
    'bg-gradient-to-r from-yellow-500 to-amber-400',
    'bg-gradient-to-r from-purple-500 to-pink-500',
    'bg-gradient-to-r from-blue-500 to-cyan-400',
    'bg-gradient-to-r from-green-500 to-emerald-400',
    'bg-gradient-to-r from-red-500 to-orange-400',
  ];
  return colors[index % colors.length];
};

export function MultiplayerRace() {
  const { isAuthenticated } = useAuth();
  const {
    race,
    userInput,
    connected,
    joinRace,
    leaveRace,
    handleKeyPress,
    inputRef
  } = useMultiplayerRace();

  // Sort players by progress for ranking
  const sortedPlayers = race?.players ? [...race.players].sort((a, b) => b.progress - a.progress) : [];

  // Show login required screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white pt-24 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          <div className="bg-linear-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 shadow-xl text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/30">
              <Trophy className="w-10 h-10 text-purple-400" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-3 bg-linear-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Multiplayer Race
            </h1>
            <p className="text-gray-400 mb-8">
              Sign in to compete with other players in real-time typing battles!
            </p>

            {/* Features List */}
            <div className="text-left space-y-3 mb-8 bg-gray-800/40 rounded-xl p-4">
              <div className="flex items-center gap-3 text-sm">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Race against players worldwide</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Climb the leaderboards</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">Create private rooms with friends</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/signin'}
                className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In to Race
              </button>
              <button
                onClick={() => window.location.href = '/signup'}
                className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
              </button>
            </div>

            {/* Practice Mode Link */}
            <p className="mt-6 text-sm text-gray-500">
              Want to practice first?{' '}
              <a href="/test" className="text-purple-400 hover:text-purple-300 underline">
                Try single player mode
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!race || race.status === 'waiting' || race.status === 'countdown') {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white pt-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Multiplayer Race
              </h1>
              <p className="text-gray-400 mt-2">Compete with others in real-time typing battles</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                connected 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {connected ? 'Connected' : 'Disconnected'}
              </div>

              <button
                onClick={() => window.location.href = '/friends'}
                className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                <Users className="w-4 h-4" />
                Friends & Rooms
              </button>
            </div>
          </div>

          {/* Countdown Overlay */}
          {race?.status === 'countdown' && race.countdown > 0 && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-center">
                <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
                  {race.countdown}
                </div>
                <p className="text-xl text-gray-300 mt-4">Get Ready!</p>
              </div>
            </div>
          )}

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
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white pt-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Race in Progress</h1>
              <p className="text-sm text-gray-400">Type fast to win!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              connected 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {connected ? 'Live' : 'Offline'}
            </div>

            <button
              onClick={() => window.location.href = '/friends'}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium"
            >
              <Users className="w-4 h-4" />
              Friends
            </button>
          </div>
        </div>

        {/* Race Progress Section */}
        <div className="mb-8 bg-linear-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Live Standings
            </h3>
            <div className="text-sm text-gray-400">
              {race.players.length} {race.players.length === 1 ? 'Racer' : 'Racers'}
            </div>
          </div>

          <div className="space-y-4">
            {sortedPlayers.map((player: Player, index: number) => (
              <div 
                key={player.id} 
                className={`relative p-4 rounded-xl transition-all duration-300 ${
                  index === 0 
                    ? 'bg-linear-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/30' 
                    : 'bg-gray-800/40 border border-gray-700/30 hover:border-gray-600/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Position */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index === 0 ? 'bg-yellow-500/20' : 'bg-gray-700/50'
                  }`}>
                    {getPositionIcon(index)}
                  </div>

                  {/* Player Avatar & Name */}
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 
                        ? 'bg-linear-to-br from-yellow-400 to-amber-500 text-black' 
                        : 'bg-linear-to-br from-purple-500 to-pink-500 text-white'
                    }`}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium truncate max-w-[100px]">{player.name}</div>
                      {player.finished && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                          Finished
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1">
                    <div className="bg-gray-700/50 rounded-full h-4 overflow-hidden relative">
                      <div 
                        className={`h-full ${getProgressColor(index)} transition-all duration-500 ease-out relative`}
                        style={{ width: `${player.progress}%` }}
                      >
                        {player.progress > 10 && (
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        )}
                      </div>
                      {/* Progress percentage inside bar */}
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/80">
                        {Math.round(player.progress)}%
                      </span>
                    </div>
                  </div>

                  {/* WPM Badge */}
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-bold text-center ${
                    index === 0 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {player.wpm} <span className="text-xs font-normal opacity-70">WPM</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typing Area */}
        <div className="bg-linear-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
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
            inputRef={inputRef as React.RefObject<HTMLDivElement>}
          />
        </div>

        {/* Race Finished Overlay */}
        {race.status === 'finished' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl text-center">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-linear-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-10 h-10 text-black" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Race Complete!</h2>
                <p className="text-gray-400">Great effort!</p>
              </div>

              {/* Final Standings */}
              <div className="space-y-3 mb-6">
                {sortedPlayers.slice(0, 3).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {getPositionIcon(index)}
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <span className="text-blue-400 font-bold">{player.wpm} WPM</span>
                  </div>
                ))}
              </div>

              <button
                onClick={leaveRace}
                className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Back to Lobby
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
