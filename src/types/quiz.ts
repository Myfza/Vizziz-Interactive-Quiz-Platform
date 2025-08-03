export interface QuizQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers?: string[];
}

export interface QuizData {
  response_code: number;
  results: QuizQuestion[];
}

export interface QuizSettings {
  category: string;
  difficulty: string;
  amount: number;
  timeLimit: number;
}

export interface QuizResult {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  category: string;
  difficulty: string;
  completedAt: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  category: string;
  difficulty: string;
  completedAt: string;
}

export interface QuizCategory {
  id: number;
  name: string;
}