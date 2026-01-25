import { motion } from 'framer-motion'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

export function Footer() {
  const socialLinks = [
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Mail, label: 'Email', href: '#' },
  ]

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border-t border-white/10 mt-auto shadow-2xl shadow-black/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <span className="text-sm sm:text-base">Made with</span>
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            </motion.div>
            <span className="text-sm sm:text-base">by TypeSpeed Team</span>
          </motion.div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            {socialLinks.map((link, idx) => {
              const Icon = link.icon
              return (
                <motion.a 
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.3, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 glass rounded-lg text-white/60 hover:text-white hover:bg-white/15 transition-all duration-300 shadow-lg"
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              )
            })}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 text-xs sm:text-sm font-medium"
          >
            © 2026 TypeSpeed. All rights reserved.
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}
