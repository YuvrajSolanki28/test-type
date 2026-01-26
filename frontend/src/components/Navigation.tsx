import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Trophy, BarChart3, BookOpen, Settings, User, Users, Menu, X, BookTextIcon, Award, Keyboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export function Navigation() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (location.pathname === '/signin' || location.pathname === '/signup') {
    return null
  }

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
      {/* Mobile Navigation - Top Bar */}
      <div className="lg:hidden">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
        >
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Keyboard className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">TypeSpeed</span>
            </Link>

            {/* Menu Toggle */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-72 z-50 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] border-l border-white/10 p-6"
            >
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl bg-white/5 text-white/70"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-2">
                {links.map((link, idx) => {
                  const isActive = location.pathname === link.path
                  const Icon = link.icon
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link 
                        to={link.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border-l-2 border-indigo-400' 
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />
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

      {/* Desktop Navigation - Bottom Bar */}
      <div className="hidden lg:block">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-1 px-2 py-2 rounded-2xl backdrop-blur-xl bg-black/60 border border-white/10 shadow-2xl shadow-black/50">
            {links.map((link) => {
              const isActive = location.pathname === link.path
              const Icon = link.icon
              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'text-white' 
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {/* Active Background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    {/* Icon */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {link.label}
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.nav>
      </div>
    </>
  )
}
