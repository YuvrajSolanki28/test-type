import axios from 'axios';

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



const STATS_KEY = 'typespeed_stats';


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
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/test-result`, result, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
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


  return newResult;
}

export async function getTestHistory(): Promise<TestResult[]> {
  if (isLoggedIn()) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      return response.data.testResults || [];
    } catch (error) {
      console.error('Failed to fetch from server:', error);
      return [];
    }
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
  if (isLoggedIn()) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      return response.data.stats || {
        totalTests: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        bestWpm: 0,
        totalTime: 0
      };
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }
  
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







export async function clearAllData() {
  if (isLoggedIn()) {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/auth/clear-data`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
    } catch (error) {
      console.error('Failed to clear server data:', error);
    }
  }

  localStorage.removeItem(STATS_KEY);

}
