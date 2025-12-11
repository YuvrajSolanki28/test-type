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

function getToken(): string | null {
  return localStorage.getItem('token');
}

function isLoggedIn(): boolean {
  return !!getToken();
}

export async function saveTestResult(result: Omit<TestResult, 'id' | 'timestamp'>): Promise<TestResult> {
  const newResult: TestResult = {
    ...result,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };

  if (isLoggedIn()) {
    try {
      await fetch('http://localhost:3001/api/auth/test-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(result)
      });
    } catch (error) {
      console.error('Failed to save to server:', error);
    }
  } else {
    const stats = await getTestHistory();
    stats.push(newResult);
    const trimmed = stats.slice(-100);
    localStorage.setItem(STATS_KEY, JSON.stringify(trimmed));
  }

  await checkAchievements(newResult);
  return newResult;
}

export async function getTestHistory(): Promise<TestResult[]> {
  if (isLoggedIn()) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        return data.testResults || [];
      }
    } catch (error) {
      console.error('Failed to fetch from server:', error);
    }
    return [];
  } else {
    try {
      const stored = localStorage.getItem(STATS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

export async function getStats() {
  const history = await getTestHistory();
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

export async function getAchievements(): Promise<Achievement[]> {
  if (isLoggedIn()) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        return data.achievements || getDefaultAchievements();
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
    return getDefaultAchievements();
  } else {
    try {
      const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
      return stored ? JSON.parse(stored) : getDefaultAchievements();
    } catch {
      return getDefaultAchievements();
    }
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

async function checkAchievements(result: TestResult) {
  const achievements = await getAchievements();
  const history = await getTestHistory();
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
    if (isLoggedIn()) {
      try {
        await fetch('http://localhost:3001/api/auth/achievements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ achievements })
        });
      } catch (error) {
        console.error('Failed to save achievements:', error);
      }
    } else {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    }
  }
}

export async function clearAllData() {
  if (isLoggedIn()) {
    try {
      await fetch('http://localhost:3001/api/auth/clear-data', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
    } catch (error) {
      console.error('Failed to clear server data:', error);
    }
  }
  
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(ACHIEVEMENTS_KEY);
}
