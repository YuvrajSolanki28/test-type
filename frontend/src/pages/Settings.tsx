import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2,  Award } from 'lucide-react'
import { clearAllData, getAchievements } from '../utils/statsManager'
export function Settings() {
  const [achievements] = useState(getAchievements())
  const [showConfirm, setShowConfirm] = useState(false)
  const handleClearData = () => {
    if (showConfirm) {
      clearAllData()
      window.location.reload()
    } else {
      setShowConfirm(true)
      setTimeout(() => setShowConfirm(false), 3000)
    }
  }
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-white/60 mb-12">
            Manage your preferences and data
          </p>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold">Achievements</h2>
            <span className="ml-auto text-white/60">
              {unlockedCount} / {achievements.length}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.1 + index * 0.05,
                }}
                className={`backdrop-blur-xl border rounded-xl p-4 ${achievement.unlocked ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 opacity-50'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-white/60">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-green-400 mt-2">
                        Unlocked{' '}
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Data Management</h2>

          <div className="space-y-4">
            <button
              onClick={handleClearData}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${showConfirm ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-400" />
                <div className="text-left">
                  <div className="font-medium">
                    {showConfirm ? 'Click again to confirm' : 'Clear All Data'}
                  </div>
                  <div className="text-sm text-white/60">
                    Delete all test history, stats, and achievements
                  </div>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
