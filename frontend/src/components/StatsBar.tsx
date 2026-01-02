import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { getSettings } from '../utils/settingsManager';
import type { Difficulty } from '../utils/aiTextGenerator';

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  time: number;
  errors: number;
  personalBest: number | null;
  difficulty: Difficulty;
  isActive: boolean;
}

export function StatsBar({
  wpm,
  accuracy,
  time,
  errors,
  personalBest,
  isActive
}: StatsBarProps) {
  const settings = getSettings();
  const showLiveWPM = settings.showWPM && isActive;

  const stats = [{
    label: 'WPM',
    value: wpm,
    color: 'from-blue-500 to-cyan-500',
    showBest: true,
    highlight: showLiveWPM
  }, {
    label: 'Accuracy',
    value: `${accuracy}%`,
    color: 'from-purple-500 to-pink-500',
    showBest: false,
    highlight: false
  }, {
    label: 'Time',
    value: `${time}s`,
    color: 'from-cyan-500 to-blue-500',
    showBest: false,
    highlight: false
  }, {
    label: 'Errors',
    value: errors,
    color: 'from-pink-500 to-red-500',
    showBest: false,
    highlight: false
  }];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`backdrop-blur-xl border rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden transition-all duration-300 ${
            stat.highlight 
              ? 'bg-white/10 border-blue-400/50 shadow-lg shadow-blue-500/20' 
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div 
            className={`absolute inset-0 bg-linear-to-br ${stat.color} transition-opacity duration-300 ${
              stat.highlight ? 'opacity-10' : 'opacity-0'
            }`} 
          />
          <div className="relative">
            <div className={`text-xs sm:text-sm mb-1 sm:mb-2 transition-colors ${
              stat.highlight ? 'text-blue-300' : 'text-white/50'
            }`}>
              {stat.label}
              {stat.highlight && <span className="ml-2 text-xs animate-pulse">LIVE</span>}
            </div>
            <motion.div
              key={stat.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-xl sm:text-2xl md:text-3xl font-bold transition-colors ${
                stat.highlight ? 'text-blue-300' : 'text-white'
              }`}
            >
              {stat.value}
            </motion.div>
            {stat.showBest && personalBest && (
              <div className="flex items-center gap-1 mt-1 sm:mt-2 text-xs text-yellow-400/70">
                <Trophy className="w-3 h-3" />
                <span>Best: {personalBest}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
