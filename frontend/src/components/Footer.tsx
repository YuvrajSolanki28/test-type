import { motion } from 'framer-motion'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/20 backdrop-blur-xl border-t border-white/10 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/60">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>by TypeSpeed Team</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
          
          <div className="text-white/40 text-sm">
            © 2026 TypeSpeed. All rights reserved.
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
