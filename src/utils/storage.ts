import { QuizResult, LeaderboardEntry } from '../types/quiz';

const STORAGE_KEYS = {
  LEADERBOARD: 'quiz_leaderboard',
  PLAYER_NAME: 'quiz_player_name',
} as const;

export function saveQuizResult(result: QuizResult): void {
  try {
    const leaderboard = getLeaderboard();
    const entry: LeaderboardEntry = {
      id: result.id,
      playerName: result.playerName,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      category: result.category,
      difficulty: result.difficulty,
      completedAt: result.completedAt,
    };
    
    leaderboard.push(entry);
    
    // Sort by percentage (descending) and then by score (descending)
    leaderboard.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return b.score - a.score;
    });
    
    // Keep only top 50 results
    const trimmedLeaderboard = leaderboard.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(trimmedLeaderboard));
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    return [];
  }
}

export function savePlayerName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
  } catch (error) {
    console.error('Error saving player name:', error);
  }
}

export function getPlayerName(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || '';
  } catch (error) {
    console.error('Error loading player name:', error);
    return '';
  }
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
  }
}