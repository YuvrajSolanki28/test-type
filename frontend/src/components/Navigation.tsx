import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Trophy, BarChart3, BookOpen, Settings, User, ChevronRight, Users, Menu, X, BookTextIcon, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export function Navigation() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (location.pathname === '/signin' || location.pathname === '/signup') {
    return null
  }

  const toggleVisibility = () => setIsVisible(!isVisible)

  const links = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/lessons', icon: BookTextIcon, label: 'Lessons' },
    { path: '/test', icon: BookOpen, label: 'Test' },
    { path: '/race', icon: Users, label: 'Race' },
    { path: '/history', icon: BarChart3, label: 'History' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/achievements', icon: Award, label: 'Achievements' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  if (isAuthenticated) {
    links.push({ path: '/profile', icon: User, label: 'Profile' })
  }

  const navLinkVariants = {
    inactive: { scale: 1, opacity: 0.6 },
    active: { scale: 1.1, opacity: 1 },
    hover: { scale: 1.15, x: 4 }
  }

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-6 left-4 z-50 p-3 glass rounded-2xl text-white/60 hover:text-white transition-colors duration-200 shadow-lg"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 glass border-r border-white/10 p-6 shadow-2xl shadow-black/50"
            >
              <div className="mt-20 flex flex-col gap-3">
                {links.map((link, idx) => {
                  const isActive = location.pathname === link.path
                  const Icon = link.icon
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link 
                        to={link.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, x: 4 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                            isActive 
                              ? 'gradient-primary text-white shadow-lg shadow-indigo-500/50' 
                              : 'glass text-white/70 hover:text-white hover:bg-white/15'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{link.label}</span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div
          className="fixed left-0 top-0 bottom-0 w-24 z-40"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        />

        <AnimatePresence>
          {!isVisible && (
            <motion.button
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
              whileHover={{ scale: 1.15, x: 4 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleVisibility}
              className="fixed left-6 top-1/2 -translate-y-1/2 z-50 p-3 glass rounded-2xl text-white/60 hover:text-white transition-colors duration-200 shadow-xl hover:shadow-indigo-500/30"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.nav
          initial={{ x: -280 }}
          animate={{ x: isVisible ? 0 : -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-50"
        >
          <div className="glass rounded-3xl p-4 shadow-2xl shadow-black/50 min-w-max">
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => {
                const isActive = location.pathname === link.path
                const Icon = link.icon
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link to={link.path} className="block">
                      <motion.div
                        variants={navLinkVariants}
                        initial="inactive"
                        animate={isActive ? 'active' : 'inactive'}
                        whileHover="hover"
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                          isActive 
                            ? 'gradient-primary text-white shadow-lg shadow-indigo-500/50' 
                            : 'glass text-white/70 hover:text-white hover:bg-white/15'
                        }`}
                        title={link.label}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.nav>
      </div>
    </>
  )
}
