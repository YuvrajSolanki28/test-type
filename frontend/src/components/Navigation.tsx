import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Trophy, BarChart3, BookOpen, Settings, User, ChevronRight, Users, Award, Menu, X, BookTextIcon } from 'lucide-react'
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

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 backdrop-blur-xl bg-white/5 border-r border-white/10 p-6"
            >
              <div className="mt-16 flex flex-col gap-2">
                {links.map((link) => {
                  const isActive = location.pathname === link.path
                  const Icon = link.icon
                  return (
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </motion.div>
                    </Link>
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
          className="fixed left-0 top-0 bottom-0 w-16 z-50"
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
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleVisibility}
              className="fixed left-6 top-1/2 -translate-y-1/2 z-50 p-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.nav
          initial={{ x: -100 }}
          animate={{ x: isVisible ? 0 : -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-50"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3 shadow-2xl">
            <div className="flex flex-col gap-2">
              {links.map((link) => {
                const isActive = location.pathname === link.path
                const Icon = link.icon
                return (
                  <Link key={link.path} to={link.path} className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </motion.nav>
      </div>
    </>
  )
}
