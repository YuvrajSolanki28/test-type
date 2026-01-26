import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Zap, Clock, Calendar } from "lucide-react";
import { getTestHistory, getStats, type TestResult } from "../utils/statsManager";
import { Loading } from "../components/Loading";

export function History() {
  const [history, setHistory] = useState<TestResult[]>([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    bestWpm: 0,
    totalTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [h, s] = await Promise.all([getTestHistory(), getStats()]);
        setHistory(h || []);
        setStats(s || { totalTests: 0, averageWpm: 0, averageAccuracy: 0, bestWpm: 0, totalTime: 0 });
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const recentTests = useMemo(() => {
    if (!history || !Array.isArray(history)) return [];
    return [...history].reverse().slice(0, 10);
  }, [history]);

  const wpmData = useMemo(() => {
    if (!history || !Array.isArray(history)) return [];
    return history.slice(-20).map((test, index) => ({
      index: index + 1,
      wpm: test.wpm,
      accuracy: test.accuracy,
      difficulty: test.difficulty,
    }));
  }, [history]);

  const maxWpm = wpmData.length > 0 ? Math.max(...wpmData.map((d) => d.wpm), 100) : 100;

  const statCards = [
    {
      icon: Zap,
      label: "Total Tests",
      value: stats.totalTests,
      color: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-400",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: TrendingUp,
      label: "Average WPM",
      value: Math.round(stats.averageWpm),
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-cyan-400",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      label: "Best WPM",
      value: stats.bestWpm,
      color: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Clock,
      label: "Total Time",
      value: `${Math.round(stats.totalTime / 60)}m`,
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
      gradient: "from-purple-500 to-pink-500"
    },
  ];

  if (loading) {
    return (
      <Loading variant="fullscreen" text="Loading your progress..." />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="fixed top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Progress
          </h1>
          <p className="text-white/70 text-lg sm:text-xl">
            Track your typing journey and improvement over time
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 group cursor-pointer"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.iconColor}`} />
                </div>
                <div className="text-xs sm:text-sm text-white/60 mb-1 font-medium">{stat.label}</div>
                <div className={`text-2xl sm:text-3xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* WPM Graph */}
        {wpmData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">WPM Progress</h2>
              <div className="px-3 py-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm text-white/70">
                Last {wpmData.length} Tests
              </div>
            </div>

            {/* Graph Container */}
            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-white/40 pr-2">
                <span>{maxWpm}</span>
                <span>{Math.round(maxWpm * 0.75)}</span>
                <span>{Math.round(maxWpm * 0.5)}</span>
                <span>{Math.round(maxWpm * 0.25)}</span>
                <span>0</span>
              </div>

              {/* Graph */}
              <div className="ml-8 sm:ml-10 h-64 sm:h-80 flex items-end gap-1 sm:gap-2 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full border-t border-white/5" />
                  ))}
                </div>

                {/* Bars */}
                {wpmData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                    <div className="w-full relative group">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${(data.wpm / maxWpm) * 100}%`, opacity: 1 }}
                        transition={{
                          delay: index * 0.03,
                          duration: 0.5,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ scale: 1.1 }}
                        className="w-full bg-linear-to-t from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl min-h-1 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all cursor-pointer relative overflow-hidden"
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-linear-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>

                      {/* Tooltip */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20"
                      >
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-3 py-2 shadow-xl whitespace-nowrap">
                          <div className="text-sm font-bold text-white mb-1">{data.wpm} WPM</div>
                          <div className="text-xs text-white/60">{data.accuracy}% accuracy</div>
                          <div className="text-xs text-white/50 capitalize">{data.difficulty}</div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              {/* X-axis label */}
              <div className="ml-8 sm:ml-10 mt-2 text-center text-xs text-white/40">
                Test Number
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Recent Tests</h2>
          </div>

          {recentTests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 sm:py-20"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
              </div>
              <p className="text-white/50 text-lg">No tests yet. Start typing to see your history!</p>
            </motion.div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                      <Calendar className="w-4 h-4" />
                      {new Date(test.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="px-3 py-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm capitalize font-medium text-indigo-300">
                      {test.difficulty}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-cyan-400 group-hover:scale-110 transition-transform">
                        {test.wpm}
                      </div>
                      <div className="text-xs text-white/50">WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-emerald-400 group-hover:scale-110 transition-transform">
                        {test.accuracy}%
                      </div>
                      <div className="text-xs text-white/50">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                        {test.time}s
                      </div>
                      <div className="text-xs text-white/50">Time</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}