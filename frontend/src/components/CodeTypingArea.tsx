// components/CodeTypingArea.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import Prism from 'prismjs';

import 'prismjs/themes/prism-tomorrow.css';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';


if (typeof window !== 'undefined') {
  (window as any).Prism = Prism;
}

interface CodeTypingAreaProps {
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

export function CodeTypingArea({
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
}: CodeTypingAreaProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      if (e.key === 'Escape') {
        onReset();
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        onKeyPress('  ');
        return;
      }

      if (e.key === 'Enter') {
        onKeyPress('\n');
        return;
      }

      if (e.key === 'Backspace') {
        onKeyPress('Backspace');
        return;
      }

      // Ignore control/meta keys
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.length === 1) {
        onKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, onReset, isComplete]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, [text]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl backdrop-blur-xl bg-gray-900/90 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
      >
        {isActive && (
          <ProgressBar
            progress={progress}
            timeLimit={timeLimit}
            timeRemaining={timeRemaining}
          />
        )}

        {isActive && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onReset}
            className="absolute top-4 right-4 p-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            title="Restart (ESC)"
          >
            <RotateCcw className="w-5 h-5 text-white/70" />
          </motion.button>
        )}

        <div
          ref={inputRef}
          tabIndex={0}
          className="relative font-mono text-lg leading-relaxed focus:outline-none whitespace-pre-wrap bg-gray-800 p-4 rounded-lg border border-gray-700"
        >
          {text.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCorrect = isTyped && userInput[index] === char;
            const isCurrent = index === userInput.length;

            return (
              <span
                key={index}
                className={`relative ${
                  isTyped
                    ? isCorrect
                      ? 'text-green-400'
                      : 'text-red-400 bg-red-500/20 rounded'
                    : 'text-gray-400'
                }`}
              >
                {char}
                {isCurrent && !isComplete && (
                  <motion.span
                    className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-blue-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </span>
            );
          })}
        </div>

        {!isActive && !isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-white/40 text-sm"
          >
            Press any key to start typing…
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
