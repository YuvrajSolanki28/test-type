import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Target, Trophy, TrendingUp, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
export function Home() {
  const { isAuthenticated } = useAuth()
  const features = [
    {
      icon: Zap,
      title: 'Real-time Tracking',
      description: 'Monitor your WPM and accuracy as you type',
    },
    {
      icon: Target,
      title: 'Multiple Difficulties',
      description: 'Practice with easy, medium, or hard texts',
    },
    {
      icon: Trophy,
      title: 'Personal Bests',
      description: 'Track your highest scores and achievements',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your improvement over time',
    },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Auth Buttons */}
        {!isAuthenticated && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="absolute top-6 right-6 flex gap-3"
          >
            <Link to="/signin">
              <button className="flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </Link>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
          </div>

          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            TypeSpeed
          </h1>

          <p className="text-2xl text-white/60 mb-12 max-w-2xl mx-auto">
            Master your typing speed with real-time feedback, detailed
            analytics, and progressive challenges
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/test">
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
              >
                Start Typing Test
              </motion.button>
            </Link>

            <Link to="/history">
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="px-8 py-4 backdrop-blur-xl bg-white/5 border border-white/10 text-white rounded-xl font-medium text-lg hover:bg-white/10 transition-all duration-300"
              >
                View Stats
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
