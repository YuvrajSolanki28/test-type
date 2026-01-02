// src/pages/Lessons.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, CheckCircle, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLessonsWithProgress, categories } from '../utils/LessonsData'

export function Lessons() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const lessonsWithProgress = getLessonsWithProgress()
  const filteredLessons = selectedCategory === 'all' 
    ? lessonsWithProgress 
    : lessonsWithProgress.filter(lesson => lesson.category === selectedCategory)

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Typing Lessons
          </h1>
          <p className="text-lg text-white/60">Master typing with structured learning</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                selectedCategory === category.id
                  ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`backdrop-blur-xl border rounded-2xl p-6 ${
                lesson.isUnlocked ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/2 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  lesson.isCompleted ? 'bg-green-500/20 text-green-400' : 
                  lesson.isUnlocked ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {lesson.isCompleted ? <CheckCircle className="w-5 h-5" /> : 
                   lesson.isUnlocked ? <Play className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-xs text-white/40">Level {lesson.level}</span>
                  <h3 className="text-lg font-semibold">{lesson.title}</h3>
                </div>
              </div>

              <p className="text-white/60 text-sm mb-4">{lesson.description}</p>

              {lesson.keys.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {lesson.keys.map((key) => (
                    <span key={key} className="px-2 py-1 bg-white/10 rounded text-xs font-mono">{key}</span>
                  ))}
                </div>
              )}

              {lesson.isUnlocked && (
                <Link to={`/lesson/${lesson.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium">
                  <Play className="w-4 h-4" />
                  {lesson.isCompleted ? 'Replay' : 'Start Lesson'}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
