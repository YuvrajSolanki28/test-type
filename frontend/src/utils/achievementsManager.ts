// Achievement definitions for TypeSpeed
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'streak' | 'milestone' | 'special';
  requirement: {
    type: 'wpm' | 'accuracy' | 'tests' | 'streak' | 'perfect' | 'time' | 'multiplayer';
    value: number;
    difficulty?: string;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface UnlockedAchievement extends Achievement {
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number; // 0-100
}

// All available achievements
export const achievements: Achievement[] = [
  // Speed achievements
  {
    id: 'speed-beginner',
    title: 'Getting Started',
    description: 'Reach 20 WPM',
    icon: '🚀',
    category: 'speed',
    requirement: { type: 'wpm', value: 20 },
    rarity: 'common',
    points: 10,
  },
  {
    id: 'speed-novice',
    title: 'Speed Novice',
    description: 'Reach 40 WPM',
    icon: '⚡',
    category: 'speed',
    requirement: { type: 'wpm', value: 40 },
    rarity: 'common',
    points: 25,
  },
  {
    id: 'speed-intermediate',
    title: 'Keyboard Warrior',
    description: 'Reach 60 WPM',
    icon: '⌨️',
    category: 'speed',
    requirement: { type: 'wpm', value: 60 },
    rarity: 'uncommon',
    points: 50,
  },
  {
    id: 'speed-advanced',
    title: 'Lightning Fingers',
    description: 'Reach 80 WPM',
    icon: '🔥',
    category: 'speed',
    requirement: { type: 'wpm', value: 80 },
    rarity: 'rare',
    points: 100,
  },
  {
    id: 'speed-expert',
    title: 'Speed Demon',
    description: 'Reach 100 WPM',
    icon: '👹',
    category: 'speed',
    requirement: { type: 'wpm', value: 100 },
    rarity: 'epic',
    points: 200,
  },
  {
    id: 'speed-master',
    title: 'Typing Master',
    description: 'Reach 120 WPM',
    icon: '🏆',
    category: 'speed',
    requirement: { type: 'wpm', value: 120 },
    rarity: 'legendary',
    points: 500,
  },
  {
    id: 'speed-legend',
    title: 'Legendary Typist',
    description: 'Reach 150 WPM',
    icon: '👑',
    category: 'speed',
    requirement: { type: 'wpm', value: 150 },
    rarity: 'legendary',
    points: 1000,
  },

  // Accuracy achievements
  {
    id: 'accuracy-good',
    title: 'Careful Typer',
    description: 'Complete a test with 95% accuracy',
    icon: '🎯',
    category: 'accuracy',
    requirement: { type: 'accuracy', value: 95 },
    rarity: 'common',
    points: 25,
  },
  {
    id: 'accuracy-great',
    title: 'Sharp Shooter',
    description: 'Complete a test with 98% accuracy',
    icon: '🎪',
    category: 'accuracy',
    requirement: { type: 'accuracy', value: 98 },
    rarity: 'uncommon',
    points: 50,
  },
  {
    id: 'accuracy-perfect',
    title: 'Perfectionist',
    description: 'Complete a test with 100% accuracy',
    icon: '💎',
    category: 'accuracy',
    requirement: { type: 'accuracy', value: 100 },
    rarity: 'rare',
    points: 150,
  },
  {
    id: 'accuracy-streak',
    title: 'Accuracy Machine',
    description: 'Complete 5 tests in a row with 95%+ accuracy',
    icon: '🤖',
    category: 'accuracy',
    requirement: { type: 'streak', value: 5 },
    rarity: 'epic',
    points: 300,
  },

  // Milestone achievements
  {
    id: 'milestone-first',
    title: 'First Steps',
    description: 'Complete your first typing test',
    icon: '🎉',
    category: 'milestone',
    requirement: { type: 'tests', value: 1 },
    rarity: 'common',
    points: 5,
  },
  {
    id: 'milestone-10',
    title: 'Getting Warmed Up',
    description: 'Complete 10 typing tests',
    icon: '🌟',
    category: 'milestone',
    requirement: { type: 'tests', value: 10 },
    rarity: 'common',
    points: 30,
  },
  {
    id: 'milestone-50',
    title: 'Dedicated Learner',
    description: 'Complete 50 typing tests',
    icon: '📚',
    category: 'milestone',
    requirement: { type: 'tests', value: 50 },
    rarity: 'uncommon',
    points: 75,
  },
  {
    id: 'milestone-100',
    title: 'Century Club',
    description: 'Complete 100 typing tests',
    icon: '💯',
    category: 'milestone',
    requirement: { type: 'tests', value: 100 },
    rarity: 'rare',
    points: 150,
  },
  {
    id: 'milestone-500',
    title: 'Typing Veteran',
    description: 'Complete 500 typing tests',
    icon: '🎖️',
    category: 'milestone',
    requirement: { type: 'tests', value: 500 },
    rarity: 'epic',
    points: 400,
  },
  {
    id: 'milestone-1000',
    title: 'Keyboard Legend',
    description: 'Complete 1000 typing tests',
    icon: '🏅',
    category: 'milestone',
    requirement: { type: 'tests', value: 1000 },
    rarity: 'legendary',
    points: 1000,
  },

  // Streak achievements
  {
    id: 'streak-3',
    title: 'Hat Trick',
    description: 'Maintain a 3-day practice streak',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 3 },
    rarity: 'common',
    points: 20,
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day practice streak',
    icon: '📅',
    category: 'streak',
    requirement: { type: 'streak', value: 7 },
    rarity: 'uncommon',
    points: 50,
  },
  {
    id: 'streak-30',
    title: 'Month Master',
    description: 'Maintain a 30-day practice streak',
    icon: '🗓️',
    category: 'streak',
    requirement: { type: 'streak', value: 30 },
    rarity: 'rare',
    points: 200,
  },
  {
    id: 'streak-100',
    title: 'Unstoppable',
    description: 'Maintain a 100-day practice streak',
    icon: '💪',
    category: 'streak',
    requirement: { type: 'streak', value: 100 },
    rarity: 'legendary',
    points: 750,
  },

  // Special achievements
  {
    id: 'special-night-owl',
    title: 'Night Owl',
    description: 'Complete a test between midnight and 5 AM',
    icon: '🦉',
    category: 'special',
    requirement: { type: 'time', value: 5 },
    rarity: 'uncommon',
    points: 40,
  },
  {
    id: 'special-early-bird',
    title: 'Early Bird',
    description: 'Complete a test between 5 AM and 7 AM',
    icon: '🐦',
    category: 'special',
    requirement: { type: 'time', value: 7 },
    rarity: 'uncommon',
    points: 40,
  },
  {
    id: 'special-speedster',
    title: 'Speedster',
    description: 'Complete a 60-second test with 80+ WPM',
    icon: '🏎️',
    category: 'special',
    requirement: { type: 'wpm', value: 80, difficulty: 'hard' },
    rarity: 'rare',
    points: 100,
  },
  {
    id: 'special-code-ninja',
    title: 'Code Ninja',
    description: 'Complete a code typing test with 50+ WPM',
    icon: '🥷',
    category: 'special',
    requirement: { type: 'wpm', value: 50, difficulty: 'code' },
    rarity: 'rare',
    points: 150,
  },
  {
    id: 'special-multiplayer-win',
    title: 'Champion',
    description: 'Win your first multiplayer race',
    icon: '🏁',
    category: 'special',
    requirement: { type: 'multiplayer', value: 1 },
    rarity: 'uncommon',
    points: 50,
  },
  {
    id: 'special-multiplayer-master',
    title: 'Race Master',
    description: 'Win 10 multiplayer races',
    icon: '🚀',
    category: 'special',
    requirement: { type: 'multiplayer', value: 10 },
    rarity: 'rare',
    points: 150,
  },
];

// Get all achievements with user progress
export function getAchievementsWithProgress(
  userStats: {
    totalTests: number;
    bestWpm: number;
    averageAccuracy: number;
    currentStreak: number;
    multiplayerWins?: number;
  },
  unlockedIds: string[] = []
): UnlockedAchievement[] {
  return achievements.map((achievement) => {
    const unlocked = unlockedIds.includes(achievement.id);
    const progress = calculateProgress(achievement, userStats);
    
    return {
      ...achievement,
      unlocked,
      unlockedAt: unlocked ? Date.now() : undefined,
      progress,
    };
  });
}

// Calculate progress towards an achievement
function calculateProgress(
  achievement: Achievement,
  stats: {
    totalTests: number;
    bestWpm: number;
    averageAccuracy: number;
    currentStreak: number;
    multiplayerWins?: number;
  }
): number {
  const { requirement } = achievement;
  let current = 0;

  switch (requirement.type) {
    case 'wpm':
      current = stats.bestWpm;
      break;
    case 'accuracy':
      current = stats.averageAccuracy;
      break;
    case 'tests':
      current = stats.totalTests;
      break;
    case 'streak':
      current = stats.currentStreak;
      break;
    case 'multiplayer':
      current = stats.multiplayerWins || 0;
      break;
    default:
      return 0;
  }

  return Math.min(100, Math.round((current / requirement.value) * 100));
}

// Check if achievement is unlocked
export function checkAchievement(
  achievementId: string,
  stats: {
    wpm: number;
    accuracy: number;
    totalTests: number;
    streak: number;
    difficulty?: string;
    isMultiplayerWin?: boolean;
    multiplayerWins?: number;
  }
): boolean {
  const achievement = achievements.find((a) => a.id === achievementId);
  if (!achievement) return false;

  const { requirement } = achievement;

  switch (requirement.type) {
    case 'wpm':
      if (requirement.difficulty && stats.difficulty !== requirement.difficulty) {
        return false;
      }
      return stats.wpm >= requirement.value;
    case 'accuracy':
      return stats.accuracy >= requirement.value;
    case 'tests':
      return stats.totalTests >= requirement.value;
    case 'streak':
      return stats.streak >= requirement.value;
    case 'multiplayer':
      return (stats.multiplayerWins || 0) >= requirement.value;
    case 'time': {
      const hour = new Date().getHours();
      if (achievement.id === 'special-night-owl') {
        return hour >= 0 && hour < 5;
      }
      if (achievement.id === 'special-early-bird') {
        return hour >= 5 && hour < 7;
      }
      return false;
    }
    default:
      return false;
  }
}

// Check all achievements after a test
export function checkAllAchievements(
  currentUnlocked: string[],
  stats: {
    wpm: number;
    accuracy: number;
    totalTests: number;
    streak: number;
    difficulty?: string;
    isMultiplayerWin?: boolean;
    multiplayerWins?: number;
  }
): string[] {
  const newlyUnlocked: string[] = [];

  for (const achievement of achievements) {
    if (currentUnlocked.includes(achievement.id)) continue;
    
    if (checkAchievement(achievement.id, stats)) {
      newlyUnlocked.push(achievement.id);
    }
  }

  return newlyUnlocked;
}

// Get achievement by ID
export function getAchievement(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}

// Get rarity color
export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'from-gray-400 to-gray-500';
    case 'uncommon':
      return 'from-green-400 to-emerald-500';
    case 'rare':
      return 'from-blue-400 to-cyan-500';
    case 'epic':
      return 'from-purple-400 to-pink-500';
    case 'legendary':
      return 'from-yellow-400 to-orange-500';
    default:
      return 'from-gray-400 to-gray-500';
  }
}

// Get total points
export function getTotalPoints(unlockedIds: string[]): number {
  return achievements
    .filter((a) => unlockedIds.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0);
}

// Local storage helpers
const STORAGE_KEY = 'typetest_achievements';

export function getStoredAchievements(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveAchievements(achievementIds: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(achievementIds));
}

export function addAchievement(achievementId: string): void {
  const current = getStoredAchievements();
  if (!current.includes(achievementId)) {
    saveAchievements([...current, achievementId]);
  }
}
