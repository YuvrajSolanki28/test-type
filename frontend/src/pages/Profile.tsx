import { motion } from 'framer-motion'
import { Mail, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

export function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/signin')
    }
  }, [user, navigate])

  if (!user) return null

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const getInitials = (name?: string) =>
    name ? name.slice(0, 2).toUpperCase() : '??'

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-white/60 mb-12">Manage your account and view your stats</p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold shrink-0">
              {getInitials(user.username)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">{user.username}</h2>
              <div className="flex items-center gap-2 text-white/60">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
