import {useState} from 'react'
import { motion } from 'framer-motion'
import {  Mail, Calendar, LogOut, Edit2, Check, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getStats } from '../utils/statsManager'
export function Profile() {
  const { user, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const stats = getStats()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  if (!user) {
    navigate('/signin')
    return null
  }
  const handleSave = () => {
    updateProfile({
      username,
    })
    setIsEditing(false)
  }
  const handleCancel = () => {
    setUsername(user.username)
    setIsEditing(false)
  }
  const handleSignOut = () => {
    signOut()
    navigate('/')
  }
  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }
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
            Profile
          </h1>
          <p className="text-white/60 mb-12">
            Manage your account and view your stats
          </p>
        </motion.div>

        {/* Profile Card */}
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
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8"
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold flex-shrink-0">
              {getInitials(user.username)}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      onClick={handleSave}
                      className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <Check className="w-5 h-5 text-green-400" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold">{user.username}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-white/60" />
                    </button>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
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
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Your Stats</h2>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Tests',
                value: stats.totalTests,
              },
              {
                label: 'Average WPM',
                value: stats.averageWpm,
              },
              {
                label: 'Best WPM',
                value: stats.bestWpm,
              },
              {
                label: 'Avg Accuracy',
                value: `${stats.averageAccuracy}%`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center"
              >
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
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
            delay: 0.3,
          }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Account Actions</h2>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <div className="text-left">
                <div className="font-medium">Sign Out</div>
                <div className="text-sm text-white/60">
                  Log out of your account
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
