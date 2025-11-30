export interface TestResult {
  id: string;
  timestamp: number;
  wpm: number;
  accuracy: number;
  errors: number;
  time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number | null;
}
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}
const STATS_KEY = 'typespeed_stats';
const ACHIEVEMENTS_KEY = 'typespeed_achievements';
export function saveTestResult(result: Omit<TestResult, 'id' | 'timestamp'>): TestResult {
  const newResult: TestResult = {
    ...result,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
  const stats = getTestHistory();
  stats.push(newResult);

  // Keep last 100 results
  const trimmed = stats.slice(-100);
  localStorage.setItem(STATS_KEY, JSON.stringify(trimmed));
  checkAchievements(newResult, trimmed);
  return newResult;
}
export function getTestHistory(): TestResult[] {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
export function getStats() {
  const history = getTestHistory();
  if (history.length === 0) {
    return {
      totalTests: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
      totalTime: 0
    };
  }
  const totalTests = history.length;
  const averageWpm = Math.round(history.reduce((sum, r) => sum + r.wpm, 0) / totalTests);
  const averageAccuracy = Math.round(history.reduce((sum, r) => sum + r.accuracy, 0) / totalTests);
  const bestWpm = Math.max(...history.map(r => r.wpm));
  const totalTime = history.reduce((sum, r) => sum + r.time, 0);
  return {
    totalTests,
    averageWpm,
    averageAccuracy,
    bestWpm,
    totalTime
  };
}
export function getAchievements(): Achievement[] {
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    return stored ? JSON.parse(stored) : getDefaultAchievements();
  } catch {
    return getDefaultAchievements();
  }
}
function getDefaultAchievements(): Achievement[] {
  return [{
    id: 'first_test',
    title: 'First Steps',
    description: 'Complete your first typing test',
    icon: '🎯',
    unlocked: false
  }, {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Reach 100 WPM',
    icon: '⚡',
    unlocked: false
  }, {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a test with 100% accuracy',
    icon: '💎',
    unlocked: false
  }, {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Complete 50 tests',
    icon: '🏆',
    unlocked: false
  }, {
    id: 'master',
    title: 'Typing Master',
    description: 'Reach 120 WPM',
    icon: '👑',
    unlocked: false
  }, {
    id: 'hard_mode',
    title: 'Challenge Accepted',
    description: 'Complete a hard difficulty test',
    icon: '🔥',
    unlocked: false
  }];
}
function checkAchievements(result: TestResult, history: TestResult[]) {
  const achievements = getAchievements();
  let updated = false;
  achievements.forEach(achievement => {
    if (achievement.unlocked) return;
    let shouldUnlock = false;
    switch (achievement.id) {
      case 'first_test':
        shouldUnlock = history.length >= 1;
        break;
      case 'speed_demon':
        shouldUnlock = result.wpm >= 100;
        break;
      case 'perfectionist':
        shouldUnlock = result.accuracy === 100;
        break;
      case 'dedicated':
        shouldUnlock = history.length >= 50;
        break;
      case 'master':
        shouldUnlock = result.wpm >= 120;
        break;
      case 'hard_mode':
        shouldUnlock = result.difficulty === 'hard';
        break;
    }
    if (shouldUnlock) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      updated = true;
    }
  });
  if (updated) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
}
export function clearAllData() {
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(ACHIEVEMENTS_KEY);
  localStorage.removeItem('typespeed_personal_bests');
}