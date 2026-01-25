import { motion } from 'framer-motion';
import { Keyboard, FileText, Code, Quote, Type } from 'lucide-react';
import type { Difficulty, TextType, Language } from '../utils/aiTextGenerator';

interface HeaderProps {
  difficulty: Difficulty;
  timeLimit: number | null;
  textType: TextType;
  language: Language;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onTimeLimitChange: (timeLimit: number | null) => void;
  onTextTypeChange: (textType: TextType) => void;
  onLanguageChange: (language: Language) => void;
  disabled: boolean;
}

export function Header({
  difficulty,
  timeLimit,
  textType,
  language,
  onDifficultyChange,
  onTimeLimitChange,
  onTextTypeChange,
  onLanguageChange,
  disabled
}: HeaderProps) {
  const buttonClassName = (isActive: boolean) => `
    px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1.5
    transform hover:scale-105 active:scale-95
    ${isActive 
      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50' 
      : 'glass text-white/70 hover:text-white hover:bg-white/15 hover:border-white/30'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
  `;

  const selectClassName = "input-glass text-white disabled:opacity-50 transition-all duration-200 hover:border-white/40 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 shadow-xl shadow-black/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="p-2 gradient-primary rounded-xl shadow-lg shadow-indigo-500/50">
              <Keyboard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gradient animate-glow">
              TypeSpeed
            </h1>
          </motion.div>

          {/* Controls Section */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Text Type Buttons */}
            <motion.div 
              className="glass rounded-2xl p-1 backdrop-blur-md"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={() => !disabled && onTextTypeChange('normal')}
                  disabled={disabled}
                  className={buttonClassName(textType === 'normal')}
                  title="Sentences"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Text</span>
                </motion.button>
                <motion.button
                  onClick={() => !disabled && onTextTypeChange('words')}
                  disabled={disabled}
                  className={buttonClassName(textType === 'words')}
                  title="Random Words"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Type className="w-4 h-4" />
                  <span className="hidden sm:inline">Words</span>
                </motion.button>
                <motion.button
                  onClick={() => !disabled && onTextTypeChange('quotes')}
                  disabled={disabled}
                  className={buttonClassName(textType === 'quotes')}
                  title="Famous Quotes"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Quote className="w-4 h-4" />
                  <span className="hidden sm:inline">Quotes</span>
                </motion.button>
                <motion.button
                  onClick={() => !disabled && onTextTypeChange('code')}
                  disabled={disabled}
                  className={buttonClassName(textType === 'code')}
                  title="Code Practice"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Code className="w-4 h-4" />
                  <span className="hidden sm:inline">Code</span>
                </motion.button>
              </div>
            </motion.div>

            {textType === 'code' && (
              <motion.select 
                value={language} 
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                disabled={disabled}
                className={selectClassName}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </motion.select>
            )}

            <motion.select
              value={difficulty}
              onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
              disabled={disabled}
              className={selectClassName}
              whileHover={{ scale: 1.05 }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </motion.select>

            <motion.select
              value={timeLimit || ''}
              onChange={(e) => onTimeLimitChange(e.target.value ? parseInt(e.target.value) : null)}
              disabled={disabled}
              className={selectClassName}
              whileHover={{ scale: 1.05 }}
            >
              <option value="">No Limit</option>
              <option value="30">30s</option>
              <option value="60">1 min</option>
              <option value="120">2 min</option>
              <option value="300">5 min</option>
            </motion.select>
          </div>
        </div>
      </div>
    </motion.header>
  );
}