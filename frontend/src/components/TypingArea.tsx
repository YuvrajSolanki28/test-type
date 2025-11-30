import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
interface TypingAreaProps {
  text: string;
  userInput: string;
  isComplete: boolean;
  isActive: boolean;
  progress: number;
  timeLimit: number | null;
  timeRemaining: number | null;
  onKeyPress: (key: string) => void;
  onReset: () => void;
  inputRef: React.RefObject<HTMLDivElement>;
}
export function TypingArea({
  text,
  userInput,
  isComplete,
  isActive,
  progress,
  timeLimit,
  timeRemaining,
  onKeyPress,
  onReset,
  inputRef
}: TypingAreaProps) {
 useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onReset();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      return;
    }
    
    // Only allow A-Z keys to start/continue the test
    if (!isActive && !/^[a-zA-Z]$/.test(e.key)) {
      return;
    }
    
    onKeyPress(e.key);
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [onKeyPress, onReset, isActive]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);
  return <div className="flex-1 flex items-center justify-center">
      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="w-full max-w-4xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

        <div className="relative">
          {/* Progress Bar */}
          {isActive && <ProgressBar progress={progress} timeLimit={timeLimit} timeRemaining={timeRemaining} />}

          {/* Restart Button */}
          {isActive && <motion.button initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} onClick={onReset} className="absolute top-0 right-0 p-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors" title="Restart (ESC)">
              <RotateCcw className="w-5 h-5 text-white/70" />
            </motion.button>}

          {/* Typing Text */}
          <div ref={inputRef} tabIndex={0} className="relative font-mono text-2xl leading-relaxed tracking-wide focus:outline-none whitespace-pre-wrap">
            {text.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isCurrent = index === userInput.length;
            const isSpace = char === ' ';
            return <span key={index} className={`relative transition-all duration-100 ${isSpace ? 'inline-block min-w-[0.5em]' : 'inline-block'} ${isTyped ? isCorrect ? 'text-green-400' : 'text-red-400 bg-red-500/20 rounded' : 'text-white/30'} ${isCurrent ? 'current-char' : ''}`}>
                  {isSpace ? '\u00A0' : char}
                  {isCurrent && !isComplete && <motion.span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" animate={{
                opacity: [1, 0.3, 1]
              }} transition={{
                duration: 0.8,
                repeat: Infinity
              }} />}
                </span>;
          })}
          </div>

          {/* Start Prompt */}
          {!isActive && !isComplete && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="mt-8 text-center text-white/40 text-sm">
              Press any letter key to start typing...
            </motion.div>}
        </div>
      </motion.div>
    </div>;
}