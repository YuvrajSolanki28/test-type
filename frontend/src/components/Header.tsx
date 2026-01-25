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
    px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
    ${isActive 
      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
      : 'bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  const selectClassName = "px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white disabled:opacity-50 hover:bg-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all [&>option]:bg-gray-800 [&>option]:text-white";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl">
              <Keyboard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TypeSpeed
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Text Type Buttons */}
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
              <button
                onClick={() => !disabled && onTextTypeChange('normal')}
                disabled={disabled}
                className={buttonClassName(textType === 'normal')}
                title="Sentences"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Text</span>
              </button>
              <button
                onClick={() => !disabled && onTextTypeChange('words')}
                disabled={disabled}
                className={buttonClassName(textType === 'words')}
                title="Random Words"
              >
                <Type className="w-4 h-4" />
                <span className="hidden sm:inline">Words</span>
              </button>
              <button
                onClick={() => !disabled && onTextTypeChange('quotes')}
                disabled={disabled}
                className={buttonClassName(textType === 'quotes')}
                title="Famous Quotes"
              >
                <Quote className="w-4 h-4" />
                <span className="hidden sm:inline">Quotes</span>
              </button>
              <button
                onClick={() => !disabled && onTextTypeChange('code')}
                disabled={disabled}
                className={buttonClassName(textType === 'code')}
                title="Code Practice"
              >
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">Code</span>
              </button>
            </div>

            {textType === 'code' && (
              <select 
                value={language} 
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                disabled={disabled}
                className={selectClassName}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            )}

            <select
              value={difficulty}
              onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
              disabled={disabled}
              className={selectClassName}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={timeLimit || ''}
              onChange={(e) => onTimeLimitChange(e.target.value ? parseInt(e.target.value) : null)}
              disabled={disabled}
              className={selectClassName}
            >
              <option value="">No Limit</option>
              <option value="30">30s</option>
              <option value="60">1 min</option>
              <option value="120">2 min</option>
              <option value="300">5 min</option>
            </select>
          </div>
        </div>
      </div>
    </motion.header>
  );
}