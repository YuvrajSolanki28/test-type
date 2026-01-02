import { useParams, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { TypingArea } from './TypingArea'
import { lessons, completeLesson } from '../utils/LessonsData'

export function Lesson() {
    const { id } = useParams()
    const lesson = lessons.find(l => l.id === id)
    const [userInput, setUserInput] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const inputRef = useRef<HTMLDivElement>(null)

    const handleKeyPress = (key: string) => {
        if (isComplete || !lesson) return

        // Filter keys based on lesson
        let allowedPattern
        if (lesson.category === 'numbers') {
            allowedPattern = /^[0-9\s]$/
        } else if (lesson.category === 'symbols') {
            allowedPattern = /^[a-zA-Z0-9\s.,?!'"@#$%]$/
        } else {
            allowedPattern = /^[a-zA-Z\s;]$/
        }

        if (!allowedPattern.test(key) && key !== 'Backspace') {
            return
        }

        if (!isActive) setIsActive(true)

        if (key === 'Backspace') {
            setUserInput(prev => prev.slice(0, -1))
        } else if (key.length === 1) {
            const newInput = userInput + key
            setUserInput(newInput)

            if (newInput.length === lesson.text.length) {
                setIsComplete(true)
            }
        }
    }

    const resetTest = () => {
        setUserInput('')
        setIsActive(false)
        setIsComplete(false)
    }

    useEffect(() => {
        if (isComplete && lesson) {
            completeLesson(lesson.id)
        }
    }, [isComplete, lesson])

    if (!lesson) return <div>Lesson not found</div>

    const progress = lesson.text.length ? Math.round((userInput.length / lesson.text.length) * 100) : 0

    return (
        <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <Link to="/lessons" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Lessons
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                    <p className="text-white/60">{lesson.description}</p>
                </div>

                <TypingArea
                    text={lesson.text}
                    userInput={userInput}
                    isComplete={isComplete}
                    isActive={isActive}
                    progress={progress}
                    timeLimit={null}
                    timeRemaining={null}
                    onKeyPress={handleKeyPress}
                    onReset={resetTest}
                    inputRef={inputRef}
                />

                {isComplete && (
                    <div className="text-center mt-8">
                        <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/20 rounded-2xl p-6 inline-block">
                            <h2 className="text-2xl font-bold text-green-400 mb-2">Lesson Complete!</h2>
                            <p className="text-white/60 mb-4">Next lesson unlocked</p>
                            <Link to="/lessons" className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium">
                                Continue Learning
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
