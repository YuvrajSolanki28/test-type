import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, CheckCircle, Star, Flame, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getDailyChallenges,
  getTimeUntilReset,
  getChallengeProgressPercent,
  getDifficultyColor,
  getTodayPoints,
  type DailyChallengeState,
} from '../utils/dailyChallengesManager';

export function DailyChallenges() {
  const [challengeState] = useState<DailyChallengeState | null>(getDailyChallenges());
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset());

  useEffect(() => {
    // Update countdown every second
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilReset());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!challengeState) return null;

  const completedCount = challengeState.progress.filter(p => p.completed).length;
  const todayPoints = getTodayPoints();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-linear-to-br from-orange-500/20 to-red-500/20 rounded-xl">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Daily Challenges</h2>
            <p className="text-white/60 text-sm">Complete challenges to earn points</p>
          </div>
        </div>
        
        {/* Countdown */}
        <div className="text-right">
          <div className="flex items-center gap-1 text-white/60 text-sm">
            <Clock className="w-4 h-4" />
            <span>Resets in</span>
          </div>
          <div className="font-mono text-lg font-bold text-orange-400">
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
            <CheckCircle className="w-5 h-5" />
            <span className="text-2xl font-bold">{completedCount}/3</span>
          </div>
          <p className="text-white/60 text-sm">Completed</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
            <Star className="w-5 h-5" />
            <span className="text-2xl font-bold">{todayPoints}</span>
          </div>
          <p className="text-white/60 text-sm">Points Earned</p>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {challengeState.challenges.map((challenge, index) => {
          const progress = challengeState.progress.find(p => p.challengeId === challenge.id);
          const progressPercent = progress ? getChallengeProgressPercent(challenge, progress) : 0;
          const isCompleted = progress?.completed || false;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl p-4 border transition-all ${
                isCompleted
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Difficulty indicator */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-linear-to-b ${getDifficultyColor(challenge.difficulty)}`} />
              
              <div className="flex items-start gap-4 ml-2">
                {/* Icon */}
                <div className={`text-3xl ${isCompleted ? '' : 'grayscale-[30%]'}`}>
                  {challenge.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${isCompleted ? 'text-green-400' : ''}`}>
                      {challenge.title}
                    </h3>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-white/60 text-sm">{challenge.description}</p>
                  
                  {/* Progress bar */}
                  {!isCompleted && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-white/40 mb-1">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-linear-to-r ${getDifficultyColor(challenge.difficulty)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reward */}
                <div className={`text-right ${isCompleted ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Trophy className="w-4 h-4" />
                    <span>+{challenge.reward}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-linear-to-r ${getDifficultyColor(challenge.difficulty)} text-white capitalize`}>
                    {challenge.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      {completedCount < 3 && (
        <Link to="/test">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3 bg-linear-to-r from-orange-500 to-red-500 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            Start Typing to Complete Challenges
          </motion.button>
        </Link>
      )}

      {completedCount === 3 && (
        <div className="mt-6 text-center py-4 bg-green-500/10 rounded-xl border border-green-500/30">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-400 font-semibold">All challenges completed!</p>
          <p className="text-white/60 text-sm">Come back tomorrow for new challenges</p>
        </div>
      )}
    </motion.div>
  );
}
