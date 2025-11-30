import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, Clock } from 'lucide-react';
import { getTestHistory, getStats } from '../utils/statsManager';
export function History() {
  const history = getTestHistory();
  const stats = getStats();
  const recentTests = useMemo(() => {
    return [...history].reverse().slice(0, 10);
  }, [history]);
  const wpmData = useMemo(() => {
    return history.slice(-20).map((test, index) => ({
      index: index + 1,
      wpm: test.wpm
    }));
  }, [history]);
  const maxWpm = Math.max(...wpmData.map(d => d.wpm), 100);
  return <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }}>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Progress
          </h1>
          <p className="text-white/60 mb-12">
            Track your typing journey and improvement over time
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[{
          icon: Zap,
          label: 'Total Tests',
          value: stats.totalTests,
          color: 'from-blue-500 to-cyan-500'
        }, {
          icon: TrendingUp,
          label: 'Average WPM',
          value: stats.averageWpm,
          color: 'from-purple-500 to-pink-500'
        }, {
          icon: Target,
          label: 'Best WPM',
          value: stats.bestWpm,
          color: 'from-cyan-500 to-blue-500'
        }, {
          icon: Clock,
          label: 'Total Time',
          value: `${Math.round(stats.totalTime / 60)}m`,
          color: 'from-pink-500 to-red-500'
        }].map((stat, index) => <motion.div key={stat.label} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/50 mb-1">{stat.label}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </motion.div>)}
        </div>

        {/* WPM Chart */}
        {wpmData.length > 0 && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">
              WPM Progress (Last 20 Tests)
            </h2>
            <div className="h-64 flex items-end gap-2">
              {wpmData.map((data, index) => <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <motion.div initial={{
                height: 0
              }} animate={{
                height: `${data.wpm / maxWpm * 100}%`
              }} transition={{
                delay: index * 0.05,
                duration: 0.5
              }} className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg min-h-[4px] hover:from-blue-400 hover:to-purple-500 transition-colors cursor-pointer" />
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {data.wpm} WPM
                    </div>
                  </div>
                </div>)}
            </div>
          </motion.div>}

        {/* Recent Tests */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Tests</h2>

          {recentTests.length === 0 ? <div className="text-center py-12 text-white/40">
              No tests yet. Start typing to see your history!
            </div> : <div className="space-y-3">
              {recentTests.map(test => <div key={test.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-white/50">
                      {new Date(test.timestamp).toLocaleDateString()}
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-lg text-sm capitalize">
                      {test.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">
                        {test.wpm}
                      </div>
                      <div className="text-xs text-white/50">WPM</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">
                        {test.accuracy}%
                      </div>
                      <div className="text-xs text-white/50">Accuracy</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">
                        {test.time}s
                      </div>
                      <div className="text-xs text-white/50">Time</div>
                    </div>
                  </div>
                </div>)}
            </div>}
        </motion.div>
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>;
}