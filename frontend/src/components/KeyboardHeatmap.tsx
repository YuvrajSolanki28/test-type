import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface KeyboardHeatmapProps {
  errorKeys: Map<string, number>;
  correctKeys: Map<string, number>;
}

// QWERTY keyboard layout
const QWERTY_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' '],
];

// Special key labels
const KEY_LABELS: Record<string, string> = {
  ' ': 'Space',
  '`': '`',
  '-': '-',
  '=': '=',
  '[': '[',
  ']': ']',
  '\\': '\\',
  ';': ';',
  "'": "'",
  ',': ',',
  '.': '.',
  '/': '/',
};

// Finger zones for coloring (reserved for future use)
// const FINGER_ZONES: Record<string, string> = {
//   '`': 'pinky', '1': 'pinky', 'q': 'pinky', 'a': 'pinky', 'z': 'pinky',
//   ...
// };

export function KeyboardHeatmap({ errorKeys, correctKeys }: KeyboardHeatmapProps) {
  const maxErrors = useMemo(() => {
    if (errorKeys.size === 0) return 1;
    return Math.max(...errorKeys.values());
  }, [errorKeys]);

  const totalKeyPresses = useMemo(() => {
    let total = 0;
    correctKeys.forEach(v => total += v);
    errorKeys.forEach(v => total += v);
    return total || 1;
  }, [correctKeys, errorKeys]);

  const getKeyStats = (key: string) => {
    const errors = errorKeys.get(key.toLowerCase()) || 0;
    const correct = correctKeys.get(key.toLowerCase()) || 0;
    const total = errors + correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
    return { errors, correct, total, accuracy };
  };

  const getKeyColor = (key: string) => {
    const { total, accuracy } = getKeyStats(key);
    
    if (total === 0) {
      // No data - show neutral
      return 'bg-white/5';
    }
    
    if (accuracy >= 95) {
      return 'bg-green-500/30 border-green-500/50';
    } else if (accuracy >= 80) {
      return 'bg-yellow-500/30 border-yellow-500/50';
    } else if (accuracy >= 60) {
      return 'bg-orange-500/40 border-orange-500/50';
    } else {
      return 'bg-red-500/50 border-red-500/60';
    }
  };

  const getIntensity = (key: string) => {
    const errors = errorKeys.get(key.toLowerCase()) || 0;
    return errors / maxErrors;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
        {QWERTY_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-1 sm:gap-1.5"
            style={{
              marginLeft: rowIndex === 2 ? '1.5rem' : rowIndex === 3 ? '2.5rem' : 0,
            }}
          >
            {row.map((key) => {
              const stats = getKeyStats(key);
              const isSpace = key === ' ';
              const intensity = getIntensity(key);
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  className={`
                    relative group cursor-pointer
                    ${isSpace ? 'w-32 sm:w-48' : 'w-8 sm:w-10'} 
                    h-8 sm:h-10 
                    rounded-lg border
                    flex items-center justify-center
                    text-xs sm:text-sm font-medium
                    transition-all duration-200
                    ${getKeyColor(key)}
                  `}
                  style={{
                    boxShadow: intensity > 0.3 ? `0 0 ${intensity * 20}px rgba(239, 68, 68, ${intensity * 0.5})` : undefined,
                  }}
                >
                  <span className={`${stats.total > 0 && stats.accuracy < 80 ? 'text-red-300' : 'text-white/80'}`}>
                    {KEY_LABELS[key] || key.toUpperCase()}
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-white/10">
                      <div className="font-bold mb-1">{KEY_LABELS[key] || key.toUpperCase()}</div>
                      {stats.total > 0 ? (
                        <>
                          <div className="text-green-400">Correct: {stats.correct}</div>
                          <div className="text-red-400">Errors: {stats.errors}</div>
                          <div className={stats.accuracy >= 80 ? 'text-green-400' : 'text-red-400'}>
                            Accuracy: {stats.accuracy}%
                          </div>
                        </>
                      ) : (
                        <div className="text-white/60">No data</div>
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 flex-wrap text-xs text-white/60 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50" />
          <span>95%+ accuracy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500/30 border border-yellow-500/50" />
          <span>80-95%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500/40 border border-orange-500/50" />
          <span>60-80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/50 border border-red-500/60" />
          <span>&lt;60%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
          <span>No data</span>
        </div>
      </div>

      {/* Stats Summary */}
      {totalKeyPresses > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">
              {Array.from(errorKeys.keys()).length}
            </div>
            <div className="text-white/60 text-sm">Keys with errors</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-red-400">
              {Array.from(errorKeys.values()).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-white/60 text-sm">Total errors</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Array.from(correctKeys.values()).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-white/60 text-sm">Correct presses</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">
              {errorKeys.size > 0 
                ? [...errorKeys.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]?.toUpperCase() || '-'
                : '-'
              }
            </div>
            <div className="text-white/60 text-sm">Most missed key</div>
          </div>
        </div>
      )}
    </div>
  );
}
