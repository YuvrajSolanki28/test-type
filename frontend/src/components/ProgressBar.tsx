import React from 'react';
import { motion } from 'framer-motion';
interface ProgressBarProps {
  progress: number;
  timeLimit: number | null;
  timeRemaining: number | null;
}
export function ProgressBar({
  progress,
  timeLimit,
  timeRemaining
}: ProgressBarProps) {
  return <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/50">Progress</span>
        {timeLimit && timeRemaining !== null && <span className="text-sm text-white/70 font-mono">
            {timeRemaining}s remaining
          </span>}
      </div>
      <div className="h-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg shadow-blue-500/50" initial={{
        width: 0
      }} animate={{
        width: `${progress}%`
      }} transition={{
        duration: 0.3,
        ease: 'easeOut'
      }} />
      </div>
    </div>;
}