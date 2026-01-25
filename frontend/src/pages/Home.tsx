import { Link } from 'react-router-dom'
import { motion, easeOut } from 'framer-motion'
import { Zap, Target, Trophy, TrendingUp, LogIn, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { DailyChallenges } from '../components/DailyChallenges'

export function Home() {
  const { isAuthenticated } = useAuth()
  const features = [
    {
      icon: Zap,
      title: 'Real-time Tracking',
      description: 'Monitor your WPM and accuracy as you type',
      gradient: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      icon: Target,
      title: 'Multiple Difficulties',
      description: 'Practice with easy, medium, or hard texts',
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      icon: Trophy,
      title: 'Personal Bests',
      description: 'Track your highest scores and achievements',
      gradient: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your improvement over time',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
      {/* Animated background gradient orbs */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="fixed top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24 relative z-10">
        {/* Auth Buttons */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-6 right-6 z-20 flex gap-2 sm:gap-3"
          >
            <Link to="/signin">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 glass rounded-xl hover:bg-white/15 transition-all duration-200 text-sm sm:text-base font-medium shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-20 sm:mb-24"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 mb-6 sm:mb-8"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/50"
            >
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 text-gradient animate-glow"
          >
            TypeSpeed
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-white/70 mb-10 sm:mb-14 max-w-2xl mx-auto px-4 leading-relaxed"
          >
            Master your typing speed with real-time feedback, detailed analytics, and progressive challenges
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center"
          >
            <Link to="/test" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3 sm:py-4 gradient-primary text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Typing Test
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link to="/history" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3 sm:py-4 glass text-white rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Stats
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16 sm:mb-20"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card group cursor-pointer"
              >
                <motion.div 
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-300" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Daily Challenges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <DailyChallenges />
        </motion.div>
      </div>
    </div>
  )
}
