// Daily Challenges System for TypeSpeed

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'wpm' | 'accuracy' | 'tests' | 'time' | 'streak';
  target: number;
  reward: number; // points
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserChallengeProgress {
  challengeId: string;
  progress: number;
  completed: boolean;
  completedAt?: number;
}

export interface DailyChallengeState {
  date: string; // YYYY-MM-DD
  challenges: DailyChallenge[];
  progress: UserChallengeProgress[];
}

// Challenge templates pool
const challengeTemplates: Omit<DailyChallenge, 'id'>[] = [
  // WPM challenges
  { title: 'Speed Burst', description: 'Achieve 50 WPM in any test', icon: '⚡', type: 'wpm', target: 50, reward: 25, difficulty: 'easy' },
  { title: 'Quick Fingers', description: 'Achieve 60 WPM in any test', icon: '🏃', type: 'wpm', target: 60, reward: 35, difficulty: 'easy' },
  { title: 'Speed Demon', description: 'Achieve 70 WPM in any test', icon: '🔥', type: 'wpm', target: 70, reward: 50, difficulty: 'medium' },
  { title: 'Lightning Fast', description: 'Achieve 80 WPM in any test', icon: '⚡', type: 'wpm', target: 80, reward: 75, difficulty: 'medium' },
  { title: 'Supersonic', description: 'Achieve 90 WPM in any test', icon: '🚀', type: 'wpm', target: 90, reward: 100, difficulty: 'hard' },
  { title: 'Untouchable', description: 'Achieve 100 WPM in any test', icon: '👑', type: 'wpm', target: 100, reward: 150, difficulty: 'hard' },
  
  // Accuracy challenges
  { title: 'Careful Touch', description: 'Complete a test with 90% accuracy', icon: '🎯', type: 'accuracy', target: 90, reward: 20, difficulty: 'easy' },
  { title: 'Precision Mode', description: 'Complete a test with 95% accuracy', icon: '🎪', type: 'accuracy', target: 95, reward: 40, difficulty: 'medium' },
  { title: 'Near Perfect', description: 'Complete a test with 98% accuracy', icon: '💎', type: 'accuracy', target: 98, reward: 60, difficulty: 'medium' },
  { title: 'Flawless', description: 'Complete a test with 100% accuracy', icon: '✨', type: 'accuracy', target: 100, reward: 100, difficulty: 'hard' },
  
  // Test count challenges
  { title: 'Warm Up', description: 'Complete 3 typing tests today', icon: '🌅', type: 'tests', target: 3, reward: 30, difficulty: 'easy' },
  { title: 'Practice Makes Perfect', description: 'Complete 5 typing tests today', icon: '📚', type: 'tests', target: 5, reward: 50, difficulty: 'medium' },
  { title: 'Marathon Runner', description: 'Complete 10 typing tests today', icon: '🏃‍♂️', type: 'tests', target: 10, reward: 100, difficulty: 'hard' },
  { title: 'Typing Machine', description: 'Complete 15 typing tests today', icon: '🤖', type: 'tests', target: 15, reward: 150, difficulty: 'hard' },
  
  // Time-based challenges
  { title: 'Quick Session', description: 'Type for a total of 5 minutes today', icon: '⏱️', type: 'time', target: 300, reward: 25, difficulty: 'easy' },
  { title: 'Dedicated Practice', description: 'Type for a total of 10 minutes today', icon: '⏰', type: 'time', target: 600, reward: 45, difficulty: 'medium' },
  { title: 'Endurance Test', description: 'Type for a total of 20 minutes today', icon: '🕐', type: 'time', target: 1200, reward: 80, difficulty: 'hard' },
];

// Get today's date string
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Generate seed from date string
function dateToSeed(dateString: string): number {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Generate daily challenges (deterministic based on date)
function generateDailyChallenges(dateString: string): DailyChallenge[] {
  const seed = dateToSeed(dateString);
  const random = seededRandom(seed);
  
  // Shuffle templates using seeded random
  const shuffled = [...challengeTemplates]
    .map((template, index) => ({ template, sort: random() + index * 0.001 }))
    .sort((a, b) => a.sort - b.sort)
    .map(item => item.template);
  
  // Select 3 challenges: 1 easy, 1 medium, 1 hard
  const easy = shuffled.find(c => c.difficulty === 'easy')!;
  const medium = shuffled.find(c => c.difficulty === 'medium')!;
  const hard = shuffled.find(c => c.difficulty === 'hard')!;
  
  return [easy, medium, hard].map((c, i) => ({
    ...c,
    id: `${dateString}-${i}`,
  }));
}

// Storage key
const STORAGE_KEY = 'typetest_daily_challenges';

// Get or create daily challenge state
export function getDailyChallenges(): DailyChallengeState {
  const today = getTodayString();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state: DailyChallengeState = JSON.parse(stored);
      
      // Check if it's still today's challenges
      if (state.date === today) {
        return state;
      }
    }
  } catch {
    // Ignore parse errors
  }
  
  // Generate new challenges for today
  const challenges = generateDailyChallenges(today);
  const state: DailyChallengeState = {
    date: today,
    challenges,
    progress: challenges.map(c => ({
      challengeId: c.id,
      progress: 0,
      completed: false,
    })),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

// Update challenge progress based on test results
export function updateChallengeProgress(testResult: {
  wpm: number;
  accuracy: number;
  time: number;
}): { challengeId: string; completed: boolean; reward: number }[] {
  const state = getDailyChallenges();
  const today = getTodayString();
  const updates: { challengeId: string; completed: boolean; reward: number }[] = [];
  
  // Get today's test count from localStorage
  const historyKey = `typetest_daily_tests_${today}`;
  const todayTests = parseInt(localStorage.getItem(historyKey) || '0') + 1;
  localStorage.setItem(historyKey, todayTests.toString());
  
  // Get today's total time
  const timeKey = `typetest_daily_time_${today}`;
  const todayTime = parseInt(localStorage.getItem(timeKey) || '0') + testResult.time;
  localStorage.setItem(timeKey, todayTime.toString());
  
  state.progress = state.progress.map(p => {
    if (p.completed) return p;
    
    const challenge = state.challenges.find(c => c.id === p.challengeId);
    if (!challenge) return p;
    
    let newProgress = p.progress;
    let completed = false;
    
    switch (challenge.type) {
      case 'wpm':
        newProgress = Math.max(p.progress, testResult.wpm);
        completed = newProgress >= challenge.target;
        break;
      case 'accuracy':
        newProgress = Math.max(p.progress, testResult.accuracy);
        completed = newProgress >= challenge.target;
        break;
      case 'tests':
        newProgress = todayTests;
        completed = newProgress >= challenge.target;
        break;
      case 'time':
        newProgress = todayTime;
        completed = newProgress >= challenge.target;
        break;
    }
    
    if (completed && !p.completed) {
      updates.push({
        challengeId: challenge.id,
        completed: true,
        reward: challenge.reward,
      });
    }
    
    return {
      ...p,
      progress: newProgress,
      completed,
      completedAt: completed ? Date.now() : undefined,
    };
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return updates;
}

// Get progress percentage for a challenge
export function getChallengeProgressPercent(challenge: DailyChallenge, progress: UserChallengeProgress): number {
  if (progress.completed) return 100;
  return Math.min(100, Math.round((progress.progress / challenge.target) * 100));
}

// Get time until next challenges
export function getTimeUntilReset(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

// Get total points earned today
export function getTodayPoints(): number {
  const state = getDailyChallenges();
  return state.progress
    .filter(p => p.completed)
    .reduce((sum, p) => {
      const challenge = state.challenges.find(c => c.id === p.challengeId);
      return sum + (challenge?.reward || 0);
    }, 0);
}

// Get difficulty color
export function getDifficultyColor(difficulty: DailyChallenge['difficulty']): string {
  switch (difficulty) {
    case 'easy':
      return 'from-green-400 to-emerald-500';
    case 'medium':
      return 'from-yellow-400 to-orange-500';
    case 'hard':
      return 'from-red-400 to-pink-500';
    default:
      return 'from-gray-400 to-gray-500';
  }
}
