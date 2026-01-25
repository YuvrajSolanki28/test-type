import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, Award, Flame, Lock, Crown, Filter } from 'lucide-react';
import { 
  achievements, 
  getAchievementsWithProgress, 
  getRarityColor, 
  getTotalPoints,
  getStoredAchievements,
  type UnlockedAchievement,
  type Achievement
} from '../utils/achievementsManager';
import { getTestHistory, getStats, type TestResult } from '../utils/statsManager';

type CategoryFilter = 'all' | Achievement['category'];
type RarityFilter = 'all' | Achievement['rarity'];

export function Achievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const stored = getStoredAchievements();
        const stats = await getStats();
        const history = await getTestHistory();
        
        // Calculate streak
        const calculateStreak = (testHistory: TestResult[]) => {
          if (testHistory.length === 0) return 0;
          const today = new Date().setHours(0, 0, 0, 0);
          const testDates = [...new Set(testHistory.map((t: TestResult) => new Date(t.timestamp).setHours(0, 0, 0, 0)))].sort((a: number, b: number) => b - a);
          
          let streak = 0;
          let expectedDate = today;
          
          for (const date of testDates) {
            if (date === expectedDate || date === expectedDate - 86400000) {
              streak++;
              expectedDate = date - 86400000;
            } else if (date < expectedDate - 86400000) {
              break;
            }
          }
          return streak;
        };

        const userStats = {
          totalTests: stats?.totalTests || history.length,
          bestWpm: stats?.bestWpm || Math.max(0, ...history.map((t: TestResult) => t.wpm)),
          averageAccuracy: stats?.averageAccuracy || (history.length > 0 ? history.reduce((sum: number, t: TestResult) => sum + t.accuracy, 0) / history.length : 0),
          currentStreak: calculateStreak(history),
          multiplayerWins: 0, // TODO: Get from backend
        };

        const achievementsWithProgress = getAchievementsWithProgress(userStats, stored);
        setUnlockedAchievements(achievementsWithProgress);
      } catch (error) {
        console.error('Failed to load achievements:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadAchievements();
  }, []);

  const filteredAchievements = unlockedAchievements.filter((a) => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    if (rarityFilter !== 'all' && a.rarity !== rarityFilter) return false;
    if (showUnlockedOnly && !a.unlocked) return false;
    return true;
  });

  const totalPoints = getTotalPoints(unlockedAchievements.filter(a => a.unlocked).map(a => a.id));
  const unlockedCount = unlockedAchievements.filter(a => a.unlocked).length;

  const categories: { id: CategoryFilter; label: string; icon: typeof Trophy }[] = [
    { id: 'all', label: 'All', icon: Star },
    { id: 'speed', label: 'Speed', icon: Zap },
    { id: 'accuracy', label: 'Accuracy', icon: Target },
    { id: 'milestone', label: 'Milestones', icon: Award },
    { id: 'streak', label: 'Streaks', icon: Flame },
    { id: 'special', label: 'Special', icon: Crown },
  ];

  const rarities: { id: RarityFilter; label: string }[] = [
    { id: 'all', label: 'All Rarities' },
    { id: 'common', label: 'Common' },
    { id: 'uncommon', label: 'Uncommon' },
    { id: 'rare', label: 'Rare' },
    { id: 'epic', label: 'Epic' },
    { id: 'legendary', label: 'Legendary' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Achievements
          </h1>
          <p className="text-white/60 mb-8">Track your progress and unlock badges</p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-3xl font-bold">{unlockedCount}</div>
            <div className="text-white/60 text-sm">/ {achievements.length} Unlocked</div>
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-3xl font-bold">{totalPoints}</div>
            <div className="text-white/60 text-sm">Total Points</div>
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-linear-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
                  style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-3xl font-bold">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
            <div className="text-white/60 text-sm">Completion</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-white/60" />
            <span className="text-white/60">Filters</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCategoryFilter(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  categoryFilter === id
                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Rarity & Unlocked Filter */}
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as RarityFilter)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {rarities.map(({ id, label }) => (
                <option key={id} value={id} className="bg-gray-800 text-white">
                  {label}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnlockedOnly}
                onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-500/50"
              />
              <span className="text-white/70">Show unlocked only</span>
            </label>
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.02 }}
                className={`relative backdrop-blur-xl rounded-2xl p-6 border transition-all ${
                  achievement.unlocked
                    ? 'bg-white/10 border-white/20 hover:border-white/40'
                    : 'bg-white/5 border-white/5 opacity-60'
                }`}
              >
                {/* Rarity indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-linear-to-r ${getRarityColor(achievement.rarity)}`} />
                
                {/* Lock overlay */}
                {!achievement.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                    <Lock className="w-8 h-8 text-white/40" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{achievement.title}</h3>
                    <p className="text-white/60 text-sm mb-2">{achievement.description}</p>
                    
                    {/* Progress bar */}
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-white/40 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-linear-to-r ${getRarityColor(achievement.rarity)} transition-all`}
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Points & Rarity */}
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full bg-linear-to-r ${getRarityColor(achievement.rarity)} text-white font-medium capitalize`}>
                        {achievement.rarity}
                      </span>
                      <span className="text-yellow-400 text-sm font-bold">
                        +{achievement.points} pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Unlocked indicator */}
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Trophy className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No achievements match your filters</p>
          </div>
        )}
      </div>

      {/* Background decorations */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
