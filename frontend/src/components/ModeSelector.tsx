import type { Difficulty } from '../utils/textLibrary';
interface ModeSelectorProps {
  difficulty: Difficulty;
  timeLimit: number | null;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onTimeLimitChange: (timeLimit: number | null) => void;
  disabled: boolean;
}
export function ModeSelector({
  difficulty,
  timeLimit,
  onDifficultyChange,
  onTimeLimitChange,
  disabled
}: ModeSelectorProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const timeLimits = [{
    label: '15s',
    value: 15
  }, {
    label: '30s',
    value: 30
  }, {
    label: '60s',
    value: 60
  }, {
    label: '∞',
    value: null
  }];
  return <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
      {/* Difficulty Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-white/50 mr-2">Difficulty:</span>
        <div className="flex gap-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-1">
          {difficulties.map(diff => <button key={diff} onClick={() => !disabled && onDifficultyChange(diff)} disabled={disabled} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${difficulty === diff ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-white/60 hover:text-white/90 hover:bg-white/5'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <span className="text-xs sm:text-sm">{diff.charAt(0).toUpperCase() + diff.slice(1)}</span>
            </button>)}
        </div>
      </div>

      {/* Time Limit Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-white/50 mr-2">Time:</span>
        <div className="flex gap-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-1">
          {timeLimits.map(time => <button key={time.label} onClick={() => !disabled && onTimeLimitChange(time.value)} disabled={disabled} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${timeLimit === time.value ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'text-white/60 hover:text-white/90 hover:bg-white/5'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <span className="text-xs sm:text-sm">{time.label}</span>
            </button>)}
        </div>
        </div>
    </div>;
}