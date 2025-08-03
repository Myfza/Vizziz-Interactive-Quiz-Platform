import React, { useState, useEffect } from 'react';
import { Play, Settings, Trophy, Clock, Users, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

interface QuizSettings {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timeLimit: number;
  gameMode: 'single' | 'multiplayer';
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

const categories = [
  'Science', 'History', 'Geography', 'Sports', 
  'Entertainment', 'Literature', 'Technology', 'Art'
];

// Extended question bank with more questions to support up to 50 questions
const questionBank: Record<string, Question[]> = {
  Science: [
    {
      id: '1',
      question: 'What is the chemical symbol for gold?',
      options: ['Go', 'Gd', 'Au', 'Ag'],
      correctAnswer: 2,
      category: 'Science',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      category: 'Science',
      difficulty: 'easy'
    },
    {
      id: '3',
      question: 'What is the speed of light in vacuum?',
      options: ['299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '298,792,458 m/s'],
      correctAnswer: 0,
      category: 'Science',
      difficulty: 'medium'
    },
    {
      id: '4',
      question: 'Which element has the atomic number 1?',
      options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'],
      correctAnswer: 1,
      category: 'Science',
      difficulty: 'easy'
    },
    {
      id: '5',
      question: 'What is the largest organ in the human body?',
      options: ['Brain', 'Liver', 'Lungs', 'Skin'],
      correctAnswer: 3,
      category: 'Science',
      difficulty: 'medium'
    },
    // Add more science questions...
    {
      id: '6',
      question: 'What is the process by which plants make their food?',
      options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
      correctAnswer: 1,
      category: 'Science',
      difficulty: 'easy'
    },
    {
      id: '7',
      question: 'Which gas makes up about 78% of Earth\'s atmosphere?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
      correctAnswer: 2,
      category: 'Science',
      difficulty: 'medium'
    },
    {
      id: '8',
      question: 'What is the hardest natural substance on Earth?',
      options: ['Gold', 'Iron', 'Diamond', 'Quartz'],
      correctAnswer: 2,
      category: 'Science',
      difficulty: 'easy'
    },
    {
      id: '9',
      question: 'How many bones are in an adult human body?',
      options: ['206', '208', '210', '204'],
      correctAnswer: 0,
      category: 'Science',
      difficulty: 'medium'
    },
    {
      id: '10',
      question: 'What is the smallest unit of matter?',
      options: ['Molecule', 'Atom', 'Electron', 'Proton'],
      correctAnswer: 1,
      category: 'Science',
      difficulty: 'easy'
    },
    // Continue adding more questions to reach 50+ per category
    {
      id: '11',
      question: 'Which scientist developed the theory of relativity?',
      options: ['Newton', 'Einstein', 'Galileo', 'Darwin'],
      correctAnswer: 1,
      category: 'Science',
      difficulty: 'medium'
    },
    {
      id: '12',
      question: 'What is the boiling point of water at sea level?',
      options: ['90°C', '95°C', '100°C', '105°C'],
      correctAnswer: 2,
      category: 'Science',
      difficulty: 'easy'
    },
    {
      id: '13',
      question: 'What type of animal is a Komodo dragon?',
      options: ['Snake', 'Lizard', 'Crocodile', 'Turtle'],
      correctAnswer: 1,
      category: 'Science',
      difficulty: 'medium'
    },
    {
      id: '14',
      question: 'Which blood type is known as the universal donor?',
      options: ['A+', 'B+', 'AB+', 'O-'],
      correctAnswer: 3,
      category: 'Science',
      difficulty: 'medium'
    },
    {
      id: '15',
      question: 'What is the chemical formula for table salt?',
      options: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'],
      correctAnswer: 0,
      category: 'Science',
      difficulty: 'easy'
    },
    // Add more to reach 50+ questions per category
    {
      id: '16',
      question: 'Which organ produces insulin?',
      options: ['Liver', 'Kidney', 'Pancreas', 'Stomach'],
      correctAnswer: 2,
      category: 'Science',
      difficulty: 'medium'
    },
    {
      id: '17',
      question: 'What is the most abundant gas in the universe?',
      options: ['Oxygen', 'Hydrogen', 'Helium', 'Nitrogen'],
      correctAnswer: 1,
      category: 'Science',
      difficulty: 'hard'
    },
    {
      id: '18',
      question: 'How many chambers does a human heart have?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
      category: 'Science',
      difficulty: 'easy'
    },
    {
      id: '19',
      question: 'What is the study of earthquakes called?',
      options: ['Geology', 'Seismology', 'Meteorology', 'Oceanography'],
      correctAnswer: 1,
      category: 'Science',
      difficulty: 'medium'
    },
    {
      id: '20',
      question: 'Which vitamin is produced when skin is exposed to sunlight?',
      options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
      correctAnswer: 3,
      category: 'Science',
      difficulty: 'medium'
    }
  ],
  History: [
    {
      id: '21',
      question: 'In which year did World War II end?',
      options: ['1944', '1945', '1946', '1947'],
      correctAnswer: 1,
      category: 'History',
      difficulty: 'easy'
    },
    {
      id: '22',
      question: 'Who was the first President of the United States?',
      options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
      correctAnswer: 2,
      category: 'History',
      difficulty: 'easy'
    },
    {
      id: '23',
      question: 'Which ancient wonder of the world was located in Alexandria?',
      options: ['Hanging Gardens', 'Lighthouse', 'Colossus', 'Mausoleum'],
      correctAnswer: 1,
      category: 'History',
      difficulty: 'medium'
    },
    {
      id: '24',
      question: 'The French Revolution began in which year?',
      options: ['1789', '1790', '1791', '1788'],
      correctAnswer: 0,
      category: 'History',
      difficulty: 'medium'
    },
    {
      id: '25',
      question: 'Who painted the ceiling of the Sistine Chapel?',
      options: ['Leonardo da Vinci', 'Raphael', 'Michelangelo', 'Donatello'],
      correctAnswer: 2,
      category: 'History',
      difficulty: 'medium'
    },
    // Add more history questions to reach 50+
    {
      id: '26',
      question: 'Which empire was ruled by Julius Caesar?',
      options: ['Greek Empire', 'Roman Empire', 'Byzantine Empire', 'Persian Empire'],
      correctAnswer: 1,
      category: 'History',
      difficulty: 'easy'
    },
    {
      id: '27',
      question: 'The Berlin Wall fell in which year?',
      options: ['1987', '1988', '1989', '1990'],
      correctAnswer: 2,
      category: 'History',
      difficulty: 'medium'
    },
    {
      id: '28',
      question: 'Who was known as the "Iron Lady"?',
      options: ['Queen Elizabeth II', 'Margaret Thatcher', 'Golda Meir', 'Indira Gandhi'],
      correctAnswer: 1,
      category: 'History',
      difficulty: 'medium'
    },
    {
      id: '29',
      question: 'Which war was fought between the North and South in America?',
      options: ['Revolutionary War', 'Civil War', 'War of 1812', 'Spanish-American War'],
      correctAnswer: 1,
      category: 'History',
      difficulty: 'easy'
    },
    {
      id: '30',
      question: 'The Titanic sank in which year?',
      options: ['1910', '1911', '1912', '1913'],
      correctAnswer: 2,
      category: 'History',
      difficulty: 'easy'
    }
  ],
  Geography: [
    {
      id: '31',
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
      correctAnswer: 2,
      category: 'Geography',
      difficulty: 'medium'
    },
    {
      id: '32',
      question: 'Which is the longest river in the world?',
      options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'],
      correctAnswer: 1,
      category: 'Geography',
      difficulty: 'easy'
    },
    {
      id: '33',
      question: 'Mount Everest is located in which mountain range?',
      options: ['Andes', 'Rockies', 'Alps', 'Himalayas'],
      correctAnswer: 3,
      category: 'Geography',
      difficulty: 'easy'
    },
    {
      id: '34',
      question: 'Which country has the most time zones?',
      options: ['Russia', 'USA', 'China', 'Canada'],
      correctAnswer: 0,
      category: 'Geography',
      difficulty: 'medium'
    },
    {
      id: '35',
      question: 'What is the smallest country in the world?',
      options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
      correctAnswer: 1,
      category: 'Geography',
      difficulty: 'medium'
    }
  ]
};

export default function PlayNow() {
  const navigate = useNavigate();
  const [showNameModal, setShowNameModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [settings, setSettings] = useState<QuizSettings>({
    category: 'Science',
    difficulty: 'medium',
    questionCount: 10,
    timeLimit: 30,
    gameMode: 'single'
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Timer effect - Fixed to use settings.timeLimit consistently
  useEffect(() => {
    if (gameStarted && !showResults && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [gameStarted, timeLeft, showResults]);

  // Generate questions based on settings - Fixed to ensure proper question count up to 50
  const generateQuestions = () => {
    const categoryQuestions = questionBank[settings.category] || [];
    const filteredQuestions = categoryQuestions.filter(q => 
      q.difficulty === settings.difficulty
    );
    
    // If not enough questions of the selected difficulty, include other difficulties
    let availableQuestions = filteredQuestions;
    if (availableQuestions.length < settings.questionCount) {
      availableQuestions = categoryQuestions;
    }
    
    // If still not enough, duplicate questions with different IDs
    while (availableQuestions.length < settings.questionCount) {
      const additionalQuestions = categoryQuestions.map((q, index) => ({
        ...q,
        id: `${q.id}_dup_${index}`
      }));
      availableQuestions = [...availableQuestions, ...additionalQuestions];
    }
    
    // Shuffle and select the required number of questions
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, settings.questionCount);
  };

  const handleStartQuiz = () => {
    if (settings.gameMode === 'multiplayer') {
      // Generate room code and navigate to multiplayer setup
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      navigate(`/lobby/${roomCode}`);
      return;
    }

    // For single player mode, show name modal
    setShowNameModal(true);
  };

  const handleSinglePlayerStart = () => {
    if (playerName.trim()) {
      setShowNameModal(false);
      startQuiz();
    }
  };

  const startQuiz = () => {
    const quizQuestions = generateQuestions();
    setQuestions(quizQuestions);
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTotalTime(0);
    setTimeLeft(settings.timeLimit);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let points = 0;
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      // Calculate points based on time remaining
      const timeBonus = Math.floor((timeLeft / settings.timeLimit) * 1000);
      points = 1000 + timeBonus;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(settings.timeLimit);
    } else {
      // Quiz finished
      setShowResults(true);
      saveResults();
    }
  };

  const saveResults = () => {
    const result = {
      playerName,
      score,
      accuracy: Math.round((correctAnswers / questions.length) * 100),
      category: settings.category,
      difficulty: settings.difficulty,
      questionsAnswered: questions.length,
      totalTime,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage for leaderboard - only after quiz completion
    const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    existingResults.push(result);
    localStorage.setItem('quizResults', JSON.stringify(existingResults));
  };

  const resetQuiz = () => {
    setGameStarted(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setSelectedAnswer(null);
    setScore(0);
    setCorrectAnswers(0);
    setTotalTime(0);
    setTimeLeft(settings.timeLimit);
  };

  if (showResults) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
                <p className="text-gray-600">Great job, {playerName}!</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">{score}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((correctAnswers / questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{correctAnswers}/{questions.length}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</div>
                  <div className="text-sm text-gray-600">Total Time</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold"
                >
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (gameStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold text-gray-700">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    {settings.category} • {settings.difficulty}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-bold">{timeLeft}s</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                {currentQuestion.question}
              </h2>

              <div className="grid gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && '✓'}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedAnswer !== null
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Play Now</h1>
            <p className="text-xl text-gray-600">Configure your quiz and start playing!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">Quiz Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={settings.category}
                    onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['easy', 'medium', 'hard'].map(difficulty => (
                      <button
                        key={difficulty}
                        onClick={() => setSettings(prev => ({ ...prev, difficulty: difficulty as any }))}
                        className={`p-3 rounded-lg font-semibold capitalize transition-all duration-200 ${
                          settings.difficulty === difficulty
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count - Fixed to support up to 50 questions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Questions: {settings.questionCount}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={settings.questionCount}
                    onChange={(e) => setSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>5</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Time Limit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time per Question: {settings.timeLimit}s
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={settings.timeLimit}
                    onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>10s</span>
                    <span>60s</span>
                  </div>
                </div>

                {/* Game Mode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Game Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, gameMode: 'single' }))}
                      className={`p-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        settings.gameMode === 'single'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Single Player
                    </button>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, gameMode: 'multiplayer' }))}
                      className={`p-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        settings.gameMode === 'multiplayer'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Multiplayer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">Quiz Preview</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Category</div>
                  <div className="font-semibold text-gray-800">{settings.category}</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Difficulty</div>
                  <div className="font-semibold text-gray-800 capitalize">{settings.difficulty}</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Questions</div>
                  <div className="font-semibold text-gray-800">{settings.questionCount} questions</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Time Limit</div>
                  <div className="font-semibold text-gray-800">{settings.timeLimit} seconds per question</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Game Mode</div>
                  <div className="font-semibold text-gray-800 capitalize">{settings.gameMode} Player</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Estimated Time</div>
                  <div className="font-semibold text-gray-800">
                    {Math.ceil((settings.questionCount * settings.timeLimit) / 60)} minutes
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartQuiz}
                className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6" />
                {settings.gameMode === 'multiplayer' ? 'Create Room' : 'Start Quiz'}
              </button>
            </div>
          </div>
        </div>

        {/* Single Player Name Modal */}
        {showNameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Enter Your Name</h3>
              <p className="text-gray-600 mb-6 text-center">
                We'll use this name to track your score on the leaderboard!
              </p>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-6"
                onKeyPress={(e) => e.key === 'Enter' && handleSinglePlayerStart()}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowNameModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSinglePlayerStart}
                  disabled={!playerName.trim()}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    playerName.trim()
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}