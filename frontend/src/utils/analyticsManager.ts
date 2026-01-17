export const trackTypingPatterns = (keystrokes: Array<{key: string, timestamp: number, correct: boolean}>) => {
  const mistakes = keystrokes.filter(k => !k.correct);
  const intervals = keystrokes.slice(1).map((k, i) => k.timestamp - keystrokes[i].timestamp);
  const avgSpeed = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  
  return {
    errorRate: mistakes.length / keystrokes.length,
    avgTypingSpeed: 60000 / avgSpeed, // WPM
    weakKeys: mistakes.map(m => m.key)
  };
};

export const generatePersonalizedText = (weakAreas: string[]) => {
  const texts: Record<string, string> = {
    'a': 'amazing apple always available',
    'e': 'every element eventually emerges',
    's': 'simple systems sometimes succeed',
    't': 'testing takes time to master'
  };
  
  return weakAreas.map(area => texts[area] || `practice ${area} more`).join(' ');
};
