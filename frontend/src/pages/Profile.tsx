import { motion } from 'framer-motion'
import { Mail, LogOut, Trophy, Target, Clock, TrendingUp, Zap, Award, Calendar, BarChart3, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import { getTestHistory, type TestResult } from '../utils/statsManager'
import { Loading } from '../components/Loading'

interface UserStats {
  totalTests: number;
  totalTime: number;
  avgWpm: number;
  avgAccuracy: number;
  bestWpm: number;
  currentStreak: number;
  longestStreak: number;
  testsThisWeek: number;
  improvementRate: number;
  favoriteMode: string;
  recentWpmTrend: number[];
}

export function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [history, setHistory] = useState<TestResult[]>([])

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/signin')
    }
  }, [user, navigate])

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getTestHistory()
        setHistory(data || [])
        
        if (data && data.length > 0) {
          // Calculate comprehensive stats
          const totalTests = data.length
          const totalTime = data.reduce((sum, t) => sum + (t.time || 0), 0)
          const avgWpm = Math.round(data.reduce((sum, t) => sum + t.wpm, 0) / totalTests)
          const avgAccuracy = Math.round(data.reduce((sum, t) => sum + t.accuracy, 0) / totalTests)
          const bestWpm = Math.max(...data.map(t => t.wpm))

          // Calculate streak
          const { currentStreak, longestStreak } = calculateStreak(data)

          // Tests this week
          const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
          const testsThisWeek = data.filter(t => t.timestamp >= weekAgo).length

          // Improvement rate (comparing first 5 tests vs last 5 tests)
          const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp)
          const firstFive = sorted.slice(0, 5)
          const lastFive = sorted.slice(-5)
          const firstAvg = firstFive.reduce((sum, t) => sum + t.wpm, 0) / firstFive.length
          const lastAvg = lastFive.reduce((sum, t) => sum + t.wpm, 0) / lastFive.length
          const improvementRate = Math.round(((lastAvg - firstAvg) / firstAvg) * 100)

          // Favorite mode
          const modeCounts: Record<string, number> = {}
          data.forEach(t => {
            modeCounts[t.difficulty] = (modeCounts[t.difficulty] || 0) + 1
          })
          const favoriteMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'medium'

          // Recent WPM trend (last 10 tests)
          const recentWpmTrend = sorted.slice(-10).map(t => t.wpm)

          setStats({
            totalTests,
            totalTime,
            avgWpm,
            avgAccuracy,
            bestWpm,
            currentStreak,
            longestStreak,
            testsThisWeek,
            improvementRate,
            favoriteMode,
            recentWpmTrend
          })
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      loadStats()
    }
  }, [user])

  const calculateStreak = (tests: TestResult[]) => {
    if (tests.length === 0) return { currentStreak: 0, longestStreak: 0 }

    const testDays = new Set(tests.map(t => new Date(t.timestamp).toDateString()))
    const sortedDays = Array.from(testDays).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1

    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    // Check if user practiced today or yesterday
    if (sortedDays[0] === today || sortedDays[0] === yesterday) {
      currentStreak = 1
      for (let i = 1; i < sortedDays.length; i++) {
        const prevDate = new Date(sortedDays[i - 1])
        const currDate = new Date(sortedDays[i])
        const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000)
        
        if (diffDays === 1) {
          currentStreak++
        } else {
          break
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < sortedDays.length; i++) {
      const prevDate = new Date(sortedDays[i - 1])
      const currDate = new Date(sortedDays[i])
      const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000)
      
      if (diffDays === 1) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak, 1)

    return { currentStreak, longestStreak }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  if (!user) return null

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const getInitials = (name?: string) =>
    name ? name.slice(0, 2).toUpperCase() : '??'

  if (loading) {
    return <Loading variant="fullscreen" text="Loading profile..." />
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-white/60 mb-8">Your typing journey and statistics</p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold shrink-0">
              {getInitials(user.username)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-2">{user.username}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-white/60 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              
              {/* Quick Stats Badges */}
              {stats && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    Best: {stats.bestWpm} WPM
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    {stats.avgAccuracy}% Avg Accuracy
                  </span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {stats.currentStreak} Day Streak
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.totalTests}</div>
              <div className="text-xs sm:text-sm text-white/50">Total Tests</div>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">{stats.avgWpm}</div>
              <div className="text-xs sm:text-sm text-white/50">Avg WPM</div>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-green-400">{formatTime(stats.totalTime)}</div>
              <div className="text-xs sm:text-sm text-white/50">Time Practiced</div>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-400">{stats.testsThisWeek}</div>
              <div className="text-xs sm:text-sm text-white/50">This Week</div>
            </div>
          </motion.div>
        )}

        {/* Progress & Achievements Row */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {/* WPM Trend Chart */}
          {stats && stats.recentWpmTrend.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Recent Progress
              </h3>
              
              <div className="h-32 flex items-end gap-1">
                {stats.recentWpmTrend.map((wpm, i) => {
                  const maxWpm = Math.max(...stats.recentWpmTrend)
                  const minWpm = Math.min(...stats.recentWpmTrend)
                  const range = maxWpm - minWpm || 1
                  const height = ((wpm - minWpm) / range) * 80 + 20
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-white/50">{wpm}</span>
                      <div
                        className="w-full bg-linear-to-t from-blue-500 to-purple-500 rounded-t transition-all"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="text-center mt-2 text-xs text-white/40">Last {stats.recentWpmTrend.length} tests</div>
              
              {stats.improvementRate !== 0 && (
                <div className={`mt-4 text-center text-sm ${stats.improvementRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.improvementRate > 0 ? '↑' : '↓'} {Math.abs(stats.improvementRate)}% improvement since you started
                </div>
              )}
            </motion.div>
          )}

          {/* Streak & Milestones */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Milestones
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-orange-400" />
                    <div>
                      <div className="font-medium">Current Streak</div>
                      <div className="text-xs text-white/50">Keep it going!</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">{stats.currentStreak} days</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="font-medium">Longest Streak</div>
                      <div className="text-xs text-white/50">Personal record</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{stats.longestStreak} days</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="font-medium">Favorite Mode</div>
                      <div className="text-xs text-white/50">Most played</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-400 capitalize">{stats.favoriteMode}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* No Stats Message */}
        {!stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center mb-6"
          >
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-semibold mb-2">No stats yet</h3>
            <p className="text-white/50 mb-4">Complete some typing tests to see your statistics!</p>
            <button
              onClick={() => navigate('/test')}
              className="px-6 py-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              Start Typing Test
            </button>
          </motion.div>
        )}

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">Account</h2>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <div className="text-left">
                <div className="font-medium">Sign Out</div>
                <div className="text-sm text-white/60">Log out of your account</div>
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Background Glow Effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
