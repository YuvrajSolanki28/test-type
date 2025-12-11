import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Lock } from 'lucide-react'
import { getAchievements, type Achievement } from '../utils/statsManager'
import { Loading } from '../components/Loading'

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAchievements() {
      try {
        const data = await getAchievements()
        setAchievements(data || [])
      } catch (error) {
        console.error('Failed to load achievements:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAchievements()
  }, [])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  if (loading) {
    return (
      <Loading variant="fullscreen" text="Loading achievements..." />
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Achievements
          </h1>
          <p className="text-white/60 mb-12">
            Unlock achievements by completing typing challenges • {unlockedCount} / {achievements.length} unlocked
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
                achievement.unlocked 
                  ? 'bg-linear-to-br from-yellow-500/10 to-orange-500/10 border-yellow-400/30 shadow-lg shadow-yellow-400/10' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`relative shrink-0 ${achievement.unlocked ? '' : 'opacity-50'}`}>
                  <div className="text-4xl">{achievement.icon}</div>
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white/40" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-bold text-lg ${achievement.unlocked ? 'text-yellow-400' : 'text-white/70'}`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <Award className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-white/80' : 'text-white/50'}`}>
                    {achievement.description}
                  </p>
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                  
                  {!achievement.unlocked && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Lock className="w-3 h-3" />
                      Locked
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {unlockedCount === achievements.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="backdrop-blur-xl bg-linear-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-8">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">Achievement Master!</h2>
              <p className="text-white/80">You've unlocked all achievements. Congratulations!</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
