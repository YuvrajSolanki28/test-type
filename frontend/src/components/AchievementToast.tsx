import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { getAchievement, getRarityColor } from '../utils/achievementsManager';

interface AchievementToastProps {
  achievementId: string | null;
  onClose: () => void;
}

// Pre-generated static positions for particles (outside component)
const PARTICLE_POSITIONS = [
  { x: 250, y: 10 },
  { x: 100, y: 30 },
  { x: 200, y: 50 },
  { x: 50, y: 20 },
  { x: 280, y: 40 },
  { x: 150, y: 60 },
  { x: 30, y: 45 },
  { x: 220, y: 25 },
];

export function AchievementToast({ achievementId, onClose }: AchievementToastProps) {
  const achievement = achievementId ? getAchievement(achievementId) : null;

  useEffect(() => {
    if (achievementId) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievementId, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {achievementId && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 right-4 z-100 max-w-sm"
        >
          <div className={`relative overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl`}>
            {/* Rarity gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${getRarityColor(achievement.rarity)}`} />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-4">
              {/* Icon with glow effect */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative"
              >
                <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-3xl shadow-lg`}>
                  {achievement.icon}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Trophy className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pr-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    Achievement Unlocked!
                  </p>
                  <h3 className="text-white font-bold text-lg truncate">
                    {achievement.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {achievement.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-linear-to-r ${getRarityColor(achievement.rarity)} text-white font-medium capitalize`}>
                      {achievement.rarity}
                    </span>
                    <span className="text-yellow-400 text-sm font-bold">
                      +{achievement.points} pts
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Animated particles */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {PARTICLE_POSITIONS.map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-yellow-400/40"
                  initial={{
                    x: 100,
                    y: 50,
                    scale: 0,
                  }}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
            
            {/* Progress bar for auto-close */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-white/40"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
