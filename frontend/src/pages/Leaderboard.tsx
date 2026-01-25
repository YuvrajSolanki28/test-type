import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Globe, Crown, Users, Calendar, Filter, TrendingUp } from 'lucide-react';
import { Loading } from '../components/Loading';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  wpm: number;
  accuracy: number;
  difficulty: string;
  time: number;
  timestamp: number;
}

interface TopPlayer {
  userId: string;
  username: string;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalTests: number;
}

type ViewType = 'global' | 'top-players';
type Difficulty = 'all' | 'easy' | 'medium' | 'hard';
type Timeframe = 'all' | 'today' | 'week' | 'month';

export function Leaderboard() {
  const { user } = useAuth();
  const [view, setView] = useState<ViewType>('top-players');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [timeframe, setTimeframe] = useState<Timeframe>('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [view, difficulty, timeframe]);

  useEffect(() => {
    if (user?.id) {
      fetchUserRank();
    }
  }, [user, difficulty]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      if (view === 'global') {
        const response = await axios.get(`${backendUrl}/api/leaderboard`, {
          params: { difficulty, timeframe, limit: 50 }
        });
        setLeaderboard(response.data.leaderboard || []);
      } else {
        const response = await axios.get(`${backendUrl}/api/leaderboard/top-players`, {
          params: { difficulty, limit: 20 }
        });
        setTopPlayers(response.data.players || []);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/leaderboard/rank/${user?.id}`, {
        params: { difficulty }
      });
      setUserRank(response.data.rank);
    } catch (error) {
      console.error('Failed to fetch user rank:', error);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-white/40 font-bold">#{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-linear-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30';
      case 1:
        return 'bg-linear-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 2:
        return 'bg-linear-to-r from-amber-600/20 to-orange-500/10 border-amber-600/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-blue-400 bg-blue-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-purple-400 bg-purple-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Global Leaderboard
              </h1>
              <p className="text-white/60 mt-2">
                Compete with typists worldwide
              </p>
            </div>

            {/* User Rank Badge */}
            {user && userRank && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-4 py-3 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
              >
                <div className="text-xs text-purple-300 mb-1">Your Rank</div>
                <div className="text-2xl font-bold text-purple-400">#{userRank}</div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* View Toggle & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* View Toggle */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setView('top-players')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                view === 'top-players'
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              Top Players
            </button>
            <button
              onClick={() => setView('global')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                view === 'global'
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <Globe className="w-4 h-4" />
              All Scores
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
              <Filter className="w-4 h-4 text-white/40 ml-2" />
              {(['all', 'easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    difficulty === diff
                      ? diff === 'all' ? 'bg-purple-500 text-white' :
                        diff === 'easy' ? 'bg-green-500 text-white' :
                        diff === 'medium' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Timeframe Filter (only for global view) */}
            {view === 'global' && (
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                <Calendar className="w-4 h-4 text-white/40 ml-2" />
                {(['all', 'today', 'week', 'month'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                      timeframe === tf
                        ? 'bg-orange-500 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {tf === 'all' ? 'All Time' : tf}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <Loading variant="inline" text="Loading leaderboard..." />
        ) : (
          <>
            {/* Top Players View */}
            {view === 'top-players' && (
              <div className="space-y-3">
                {topPlayers.length === 0 ? (
                  <div className="text-center py-16 text-white/40">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">No players yet</p>
                    <p className="text-sm mt-2">Be the first to set a record!</p>
                  </div>
                ) : (
                  topPlayers.map((player, index) => (
                    <motion.div
                      key={player.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`backdrop-blur-xl border rounded-2xl p-4 sm:p-5 ${getRankBg(index)} ${
                        user?.id === player.userId ? 'ring-2 ring-purple-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                          {getRankIcon(index)}
                        </div>

                        {/* Avatar & Name */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-linear-to-br from-yellow-400 to-amber-500 text-black' :
                            index === 1 ? 'bg-linear-to-br from-gray-300 to-gray-400 text-black' :
                            index === 2 ? 'bg-linear-to-br from-amber-500 to-orange-600 text-black' :
                            'bg-linear-to-br from-purple-500 to-pink-500 text-white'
                          }`}>
                            {player.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate flex items-center gap-2">
                              {player.username}
                              {user?.id === player.userId && (
                                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">You</span>
                              )}
                            </div>
                            <div className="text-xs text-white/50">{player.totalTests} tests completed</div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden sm:flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-xs text-white/50 mb-1">Avg WPM</div>
                            <div className="text-lg font-semibold text-blue-400">{player.avgWpm}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-white/50 mb-1">Accuracy</div>
                            <div className="text-lg font-semibold text-green-400">{player.avgAccuracy}%</div>
                          </div>
                        </div>

                        {/* Best WPM */}
                        <div className="text-right">
                          <div className="text-xs text-white/50 mb-1">Best</div>
                          <div className={`text-2xl sm:text-3xl font-bold ${
                            index === 0 ? 'text-yellow-400' :
                            index === 1 ? 'text-gray-300' :
                            index === 2 ? 'text-amber-500' : 'text-blue-400'
                          }`}>
                            {player.bestWpm}
                          </div>
                          <div className="text-xs text-white/50">WPM</div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Global Scores View */}
            {view === 'global' && (
              <div className="space-y-2">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-16 text-white/40">
                    <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">No scores yet</p>
                    <p className="text-sm mt-2">Take a test to appear on the leaderboard!</p>
                  </div>
                ) : (
                  leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.id + index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`backdrop-blur-xl border rounded-xl p-3 sm:p-4 flex items-center justify-between ${
                        getRankBg(index)
                      } ${user?.id === entry.userId ? 'ring-2 ring-purple-500' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center">
                          {getRankIcon(index)}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                          {entry.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-sm sm:text-base flex items-center gap-2">
                            {entry.username || 'Anonymous'}
                            {user?.id === entry.userId && (
                              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">You</span>
                            )}
                          </div>
                          <div className="text-xs text-white/50 flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-xs ${getDifficultyColor(entry.difficulty)}`}>
                              {entry.difficulty}
                            </span>
                            <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl sm:text-2xl font-bold ${
                          index === 0 ? 'text-yellow-400' :
                          index === 1 ? 'text-gray-300' :
                          index === 2 ? 'text-amber-500' : 'text-blue-400'
                        }`}>
                          {entry.wpm}
                        </div>
                        <div className="text-xs text-white/50">{entry.accuracy}% acc</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-bold mb-2">Want to appear on the leaderboard?</h3>
              <p className="text-white/60 mb-4">Sign in to track your scores and compete globally!</p>
              <div className="flex gap-3 justify-center">
                <a
                  href="/signin"
                  className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:scale-105 transition-transform"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="px-6 py-2 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
