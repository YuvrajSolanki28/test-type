// src/utils/lessonsData.ts
import { BookOpen, Star } from 'lucide-react'

export interface Lesson {
  id: string
  title: string
  description: string
  level: number
  category: 'basics' | 'numbers' | 'symbols' | 'advanced'
  keys: string[]
  text: string
  isUnlocked: boolean
  isCompleted: boolean
  stars: number
}

export const lessons: Lesson[] = [
  // Basics - Easy
  { id: '1', title: 'Home Row', description: 'Learn ASDF JKL;', level: 1, category: 'basics', keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'], text: 'asdf jkl; asdf jkl;', isUnlocked: true, isCompleted: false, stars: 0 },
  { id: '2', title: 'Home Row Words', description: 'Simple home row words', level: 2, category: 'basics', keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'], text: 'sad lad ask flask', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '3', title: 'Top Row', description: 'Add QWER UIOP', level: 3, category: 'basics', keys: ['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'], text: 'qwer uiop were pour', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '4', title: 'Top + Home', description: 'Combine rows', level: 4, category: 'basics', keys: [], text: 'were ask pour flask', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '5', title: 'Bottom Row', description: 'Add ZXCV BNM', level: 5, category: 'basics', keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'], text: 'zxcv bnm zoom cave', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '6', title: 'All Letters', description: 'Complete alphabet', level: 6, category: 'basics', keys: [], text: 'zoom cave were ask pour', isUnlocked: false, isCompleted: false, stars: 0 },
  
  // Numbers - Medium
  { id: '7', title: 'Numbers 1-5', description: 'Left hand numbers', level: 7, category: 'numbers', keys: ['1', '2', '3', '4', '5'], text: '12345 54321 123', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '8', title: 'Numbers 6-0', description: 'Right hand numbers', level: 8, category: 'numbers', keys: ['6', '7', '8', '9', '0'], text: '67890 09876 678', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '9', title: 'All Numbers', description: 'Complete number row', level: 9, category: 'numbers', keys: [], text: '1234567890 0987654321', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '10', title: 'Numbers + Letters', description: 'Mix numbers and letters', level: 10, category: 'numbers', keys: [], text: 'room 123 door 456 key 789', isUnlocked: false, isCompleted: false, stars: 0 },
  
  // Symbols - Medium to Hard
  { id: '11', title: 'Basic Punctuation', description: 'Period and comma', level: 11, category: 'symbols', keys: ['.', ','], text: 'Hello, world. Nice day.', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '12', title: 'Question & Exclamation', description: 'Add ? and !', level: 12, category: 'symbols', keys: ['?', '!'], text: 'How are you? Great! Fine.', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '13', title: 'Quotes & Apostrophe', description: 'Add quotes', level: 13, category: 'symbols', keys: ['"', "'"], text: "It's a \"great\" day today!", isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '14', title: 'Special Symbols', description: 'Add @#$%', level: 14, category: 'symbols', keys: ['@', '#', '$', '%'], text: 'Email@domain.com #tag $100 50%', isUnlocked: false, isCompleted: false, stars: 0 },
  
  // Advanced - Hard
  { id: '15', title: 'Common Words', description: 'Frequent English words', level: 15, category: 'advanced', keys: [], text: 'the quick brown fox jumps over lazy dog', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '16', title: 'Sentences', description: 'Complete sentences', level: 16, category: 'advanced', keys: [], text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '17', title: 'Mixed Content', description: 'Letters, numbers, symbols', level: 17, category: 'advanced', keys: [], text: 'User123@email.com logged in at 9:30 AM with 95% success rate!', isUnlocked: false, isCompleted: false, stars: 0 },
  { id: '18', title: 'Speed Challenge', description: 'Fast typing test', level: 18, category: 'advanced', keys: [], text: 'Programming requires precision, patience, and practice. Debug code carefully, test thoroughly, deploy confidently.', isUnlocked: false, isCompleted: false, stars: 0 },
]


export const categories = [
  { id: 'all', name: 'All', icon: BookOpen },
  { id: 'basics', name: 'Basics', icon: BookOpen },
  { id: 'numbers', name: 'Numbers', icon: BookOpen },
  { id: 'symbols', name: 'Symbols', icon: BookOpen },
  { id: 'advanced', name: 'Advanced', icon: Star },
]

// Add to utils/LessonsData.ts
const LESSONS_PROGRESS_KEY = 'lessons_progress'

export function getLessonsProgress() {
  const stored = localStorage.getItem(LESSONS_PROGRESS_KEY)
  return stored ? JSON.parse(stored) : { completed: [], unlocked: ['1'] }
}

export function completeLesson(lessonId: string) {
  const progress = getLessonsProgress()
  if (!progress.completed.includes(lessonId)) {
    progress.completed.push(lessonId)
    const nextLevel = parseInt(lessonId) + 1
    if (nextLevel <= lessons.length && !progress.unlocked.includes(nextLevel.toString())) {
      progress.unlocked.push(nextLevel.toString())
    }
    localStorage.setItem(LESSONS_PROGRESS_KEY, JSON.stringify(progress))
  }
}

export function getLessonsWithProgress() {
  const progress = getLessonsProgress()
  return lessons.map(lesson => ({
    ...lesson,
    isUnlocked: progress.unlocked.includes(lesson.id),
    isCompleted: progress.completed.includes(lesson.id)
  }))
}
