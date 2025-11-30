import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type{ Difficulty } from '../utils/textLibrary';
interface StatsBarProps {
  wpm: number;
  accuracy: number;
  time: number;
  errors: number;
  personalBest: number | null;
  difficulty: Difficulty;
}
export function StatsBar({
  wpm,
  accuracy,
  time,
  errors,
  personalBest,
}: StatsBarProps) {
  const stats = [{
    label: 'WPM',
    value: wpm,
    color: 'from-blue-500 to-cyan-500',
    showBest: true
  }, {
    label: 'Accuracy',
    value: `${accuracy}%`,
    color: 'from-purple-500 to-pink-500',
    showBest: false
  }, {
    label: 'Time',
    value: `${time}s`,
    color: 'from-cyan-500 to-blue-500',
    showBest: false
  }, {
    label: 'Errors',
    value: errors,
    color: 'from-pink-500 to-red-500',
    showBest: false
  }];
  return <div className="grid grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => <motion.div key={stat.label} initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: index * 0.1
    }} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-300`} />
          <div className="relative">
            <div className="text-sm text-white/50 mb-2">{stat.label}</div>
            <motion.div key={stat.value} initial={{
          scale: 1.2,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} className="text-3xl font-bold text-white">
              {stat.value}
            </motion.div>
            {stat.showBest && personalBest && <div className="flex items-center gap-1 mt-2 text-xs text-yellow-400/70">
                <Trophy className="w-3 h-3" />
                <span>Best: {personalBest}</span>
              </div>}
          </div>
        </motion.div>)}
    </div>;
}