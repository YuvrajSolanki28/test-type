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

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl glass rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-indigo-500/20"
      >
        {/* Background gradient accent */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        
        {/* Glassmorphism rim effect */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/10 to-transparent pointer-events-none" style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          borderRadius: '24px'
        }} />

        <div className="relative">
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProgressBar 
                progress={progress} 
                timeLimit={timeLimit} 
                timeRemaining={timeRemaining} 
              />
            </motion.div>
          )}

          {isActive && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onReset}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-0 right-0 p-2 glass rounded-xl hover:bg-white/15 transition-all duration-200 shadow-lg"
              title="Restart (ESC)"
            >
              <RotateCcw className="w-5 h-5 text-indigo-400" />
            </motion.button>
          )}

          <div
            ref={inputRef}
            tabIndex={0}
            className="relative font-mono text-lg sm:text-2xl leading-relaxed tracking-wide focus:outline-none whitespace-pre-wrap transition-all duration-200"
          >
            {text.split('').map((char, index) => {
              const isTyped = index < userInput.length;
              const isCorrect = isTyped && userInput[index] === char;
              const isCurrent = index === userInput.length;
              const isSpace = char === ' ';

              return (
                <motion.span
                  key={index}
                  initial={{ opacity: 0.3, y: 0 }}
                  animate={{
                    opacity: isTyped ? 1 : 0.3,
                    y: isCurrent ? -2 : 0,
                  }}
                  transition={{ duration: 0.1 }}
                  className={`relative transition-all duration-100 ${
                    isSpace ? 'inline-block min-w-[0.5em]' : 'inline-block'
                  } ${
                    isTyped
                      ? isCorrect
                        ? 'text-emerald-400'
                        : 'text-red-400 bg-red-500/20 rounded px-0.5'
                      : 'text-white/30'
                  } ${isCurrent ? 'current-char' : ''}`}
                >
                  {isSpace ? '\u00A0' : char}
                  {isCurrent && !isComplete && (
                    <motion.span
                      className="absolute -left-1 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-400 to-purple-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] rounded-full"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.span>
              );
            })}
          </div>

          {!isActive && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-center"
            >
              <p className="text-white/50 text-sm mb-3">Press any letter to start</p>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <div className="px-4 py-2 glass rounded-xl text-white/70 text-xs font-medium">
                  Ready to type...
                </div>
              </motion.div>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-center"
              >
                <p className="text-emerald-400 font-bold text-lg">Complete! 🎉</p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
