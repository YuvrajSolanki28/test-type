import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Target, Zap, ChevronDown, Keyboard, Share2 } from 'lucide-react';
import type{ Difficulty } from '../utils/aiTextGenerator';
import { KeyboardHeatmap } from './KeyboardHeatmap';
import { SocialShare } from './SocialShare';

interface ResultsModalProps {
  wpm: number;
  accuracy: number;
  errors: number;
  time: number;
  difficulty: Difficulty;
  personalBest: number | null;
  isNewRecord: boolean;
  onRestart: () => void;
  errorKeys?: Map<string, number>;
  correctKeys?: Map<string, number>;
}

export function ResultsModal({
  wpm,
  accuracy,
  errors,
  time,
  difficulty,
  personalBest,
  isNewRecord,
  onRestart,
  errorKeys = new Map(),
  correctKeys = new Map(),
}: ResultsModalProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
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
  return <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
  >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        transition={{ delay: 0.1, duration: 0.4, type: "spring" }} 
        className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-indigo-500/30"
      >
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10" />

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
            {isNewRecord && (
              <motion.div 
                initial={{ scale: 0, rotate: -180 }} 
                animate={{ scale: 1, rotate: 0 }} 
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-500/50 rounded-full mb-4 shadow-lg shadow-emerald-500/30"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                  <Trophy className="w-5 h-5" />
                </motion.div>
                <span className="font-bold">New Personal Best!</span>
              </motion.div>
            )}
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
            >
              Test Complete!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/70"
            >
              Difficulty:{' '}
              <span className="text-white font-semibold capitalize">
                {difficulty}
              </span>
            </motion.p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div 
                  key={stat.label} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-center cursor-pointer bg-linear-to-br ${stat.color} shadow-lg transition-all duration-300`}
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 mb-2 sm:mb-3">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Personal Best Comparison */}
          {personalBest && !isNewRecord && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.5 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </motion.div>
                <span className="text-white/80 font-medium">
                  Your best on {difficulty}:
                </span>
              </div>
              <span className="text-xl font-bold text-indigo-300">
                {personalBest} WPM
              </span>
            </motion.div>
          )}

          {/* Errors */}
          {errors > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.6 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 bg-linear-to-r from-red-500/20 to-orange-500/20 border-red-500/30 rounded-2xl p-4 mb-6 text-center"
            >
              <span className="text-red-300 font-medium">
                {errors} mistake{errors !== 1 ? 's' : ''} made
              </span>
            </motion.div>
          )}

          {/* Keyboard Heatmap Toggle */}
          {(errorKeys.size > 0 || correctKeys.size > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <motion.button
                onClick={() => setShowHeatmap(!showHeatmap)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between px-4 py-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl hover:bg-white/15 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-indigo-400" />
                  <span className="text-white font-medium">Keyboard Analysis</span>
                </div>
                <motion.div
                  animate={{ rotate: showHeatmap ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-white/60" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {showHeatmap && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      <KeyboardHeatmap
                        errorKeys={errorKeys}
                        correctKeys={correctKeys}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 sm:gap-4">
            <motion.button 
              onClick={onRestart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all duration-300"
            >
              Try Again
            </motion.button>
            <motion.button 
              onClick={() => setShowShare(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-md bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/15 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Social Share Modal */}
      <SocialShare
        result={{
          wpm,
          accuracy,
          time,
          difficulty,
          isNewRecord,
        }}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </motion.div>;
}