import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Target, Zap } from 'lucide-react';
import type{ Difficulty } from '../utils/textLibrary';
interface ResultsModalProps {
  wpm: number;
  accuracy: number;
  errors: number;
  time: number;
  difficulty: Difficulty;
  personalBest: number | null;
  isNewRecord: boolean;
  onRestart: () => void;
}
export function ResultsModal({
  wpm,
  accuracy,
  errors,
  time,
  difficulty,
  personalBest,
  isNewRecord,
  onRestart
}: ResultsModalProps) {
  const stats = [{
    icon: Zap,
    label: 'WPM',
    value: wpm,
    color: 'from-blue-500 to-cyan-500'
  }, {
    icon: Target,
    label: 'Accuracy',
    value: `${accuracy}%`,
    color: 'from-purple-500 to-pink-500'
  }, {
    icon: TrendingUp,
    label: 'Time',
    value: `${time}s`,
    color: 'from-cyan-500 to-blue-500'
  }];
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{
      scale: 0.9,
      opacity: 0,
      y: 20
    }} animate={{
      scale: 1,
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.1
    }} className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10" />

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
            {isNewRecord && <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            delay: 0.3,
            type: 'spring'
          }} className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full mb-4">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  New Personal Best!
                </span>
              </motion.div>}
            <h2 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Test Complete!
            </h2>
            <p className="text-white/60">
              Difficulty:{' '}
              <span className="text-white/90 font-medium capitalize">
                {difficulty}
              </span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2 + index * 0.1
          }} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} mb-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </motion.div>)}
          </div>

          {/* Personal Best Comparison */}
          {personalBest && !isNewRecord && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-400/70" />
                <span className="text-white/70">
                  Your best on {difficulty}:
                </span>
              </div>
              <span className="text-xl font-bold text-white">
                {personalBest} WPM
              </span>
            </motion.div>}

          {/* Errors */}
          {errors > 0 && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.6
        }} className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-center">
              <span className="text-red-400">
                {errors} mistake{errors !== 1 ? 's' : ''} made
              </span>
            </motion.div>}

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={onRestart} className="flex-1 px-6 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>;
}