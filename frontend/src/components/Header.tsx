import { Link } from 'react-router-dom';
import { ModeSelector } from './ModeSelector';
import type{ Difficulty } from '../utils/textLibrary';
interface HeaderProps {
  difficulty: Difficulty;
  timeLimit: number | null;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onTimeLimitChange: (timeLimit: number | null) => void;
  disabled: boolean;
}
export function Header({
  difficulty,
  timeLimit,
  onDifficultyChange,
  onTimeLimitChange,
  disabled
}: HeaderProps) {
  return <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="text-xl font-semibold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            TypeSpeed
          </h1>
        </Link>

        <ModeSelector difficulty={difficulty} timeLimit={timeLimit} onDifficultyChange={onDifficultyChange} onTimeLimitChange={onTimeLimitChange} disabled={disabled} />
      </div>
    </header>;
}