import { QuizData, QuizSettings, QuizCategory } from '../types/quiz';

const BASE_URL = 'https://opentdb.com/api.php';
const CATEGORIES_URL = 'https://opentdb.com/api_category.php';

export async function fetchQuizData(settings: QuizSettings): Promise<QuizData> {
  const params = new URLSearchParams({
    amount: settings.amount.toString(),
    difficulty: settings.difficulty,
    type: 'multiple',
  });

  if (settings.category !== 'any') {
    params.append('category', settings.category);
  }

  const response = await fetch(`${BASE_URL}?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch quiz data');
  }

  const data: QuizData = await response.json();
  
  if (data.response_code !== 0) {
    throw new Error(getErrorMessage(data.response_code));
  }

  // Shuffle answers for each question
  data.results = data.results.map(question => ({
    ...question,
    all_answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
  }));

  return data;
}

export async function fetchCategories(): Promise<QuizCategory[]> {
  try {
    const response = await fetch(CATEGORIES_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.trivia_categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

function getErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'No results found. Try different settings.';
    case 2:
      return 'Invalid parameter. Please check your settings.';
    case 3:
      return 'Token not found.';
    case 4:
      return 'Token empty.';
    default:
      return 'An unknown error occurred.';
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}