import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { getTestHistory } from '../utils/statsManager';
export function Leaderboard() {
  const history = getTestHistory();
  const leaderboards = useMemo(() => {
    const difficulties = ['easy', 'medium', 'hard'] as const;
    return difficulties.map(difficulty => {
      const tests = history.filter(t => t.difficulty === difficulty);
      const topScores = [...tests].sort((a, b) => b.wpm - a.wpm).slice(0, 10);
      return {
        difficulty,
        scores: topScores
      };
    });
  }, [history]);
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-white/40">#{index + 1}</span>;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }}>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Personal Records
          </h1>
          <p className="text-white/60 mb-12">
            Your top 10 scores for each difficulty level
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {leaderboards.map((board, boardIndex) => <motion.div key={board.difficulty} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: boardIndex * 0.1
        }} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${board.difficulty === 'easy' ? 'bg-green-500/20' : board.difficulty === 'medium' ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                  <Trophy className={`w-5 h-5 ${board.difficulty === 'easy' ? 'text-green-400' : board.difficulty === 'medium' ? 'text-blue-400' : 'text-red-400'}`} />
                </div>
                <h2 className="text-2xl font-bold capitalize">
                  {board.difficulty}
                </h2>
              </div>

              {board.scores.length === 0 ? <div className="text-center py-12 text-white/40">
                  No scores yet for this difficulty
                </div> : <div className="space-y-2">
                  {board.scores.map((score, index) => <motion.div key={score.id} initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: boardIndex * 0.1 + index * 0.05
            }} className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between ${index === 0 ? 'ring-2 ring-yellow-400/50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center">
                          {getRankIcon(index)}
                        </div>
                        <div>
                          <div className="text-sm text-white/50">
                            {new Date(score.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-white/40">
                            {score.accuracy}% accuracy
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400">
                          {score.wpm}
                        </div>
                        <div className="text-xs text-white/50">WPM</div>
                      </div>
                    </motion.div>)}
                </div>}
            </motion.div>)}
        </div>
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>;
}