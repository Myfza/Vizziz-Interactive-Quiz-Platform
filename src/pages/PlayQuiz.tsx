import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Trophy,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';
import { Layout } from '../components/Layout';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

interface Player {
  id: string;
  nickname: string;
  score: number;
  answered: boolean;
}

// Sample questions for demo
const sampleQuestions: Question[] = [
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
    question: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'easy'
  }
];

export default function PlayQuiz() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [players] = useState<Player[]>([
    { id: '1', nickname: 'You', score: 0, answered: false },
    { id: '2', nickname: 'Alice', score: 1200, answered: true },
    { id: '3', nickname: 'Bob', score: 800, answered: false }
  ]);

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleAnswer(null);
    }
  }, [timeLeft, showFeedback]);

  const handleAnswer = (answerIndex: number | null) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    // Calculate score based on correctness and time
    if (answerIndex === currentQuestion.correctAnswer) {
      const timeBonus = Math.floor((timeLeft / 30) * 500);
      const points = 1000 + timeBonus;
      setScore(prev => prev + points);
    }

    // Move to next question after showing feedback
    setTimeout(() => {
      if (currentQuestionIndex < sampleQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(30);
      } else {
        // Quiz finished, navigate to results
        navigate(`/results/${sessionId}`);
      }
    }, 2000);
  };

  const getAnswerButtonClass = (optionIndex: number) => {
    if (!showFeedback) {
      return selectedAnswer === optionIndex
        ? 'border-orange-500 bg-orange-50 text-orange-700'
        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50';
    }

    if (optionIndex === currentQuestion.correctAnswer) {
      return 'border-green-500 bg-green-50 text-green-700';
    }

    if (optionIndex === selectedAnswer && optionIndex !== currentQuestion.correctAnswer) {
      return 'border-red-500 bg-red-50 text-red-700';
    }

    return 'border-gray-200 bg-gray-50 text-gray-500';
  };

  const getTimeColor = () => {
    if (timeLeft > 20) return 'text-green-600';
    if (timeLeft > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Quiz Area */}
            <div className="lg:col-span-3">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 mb-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-700">
                      Question {currentQuestionIndex + 1} of {sampleQuestions.length}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {currentQuestion.category} • {currentQuestion.difficulty}
                    </span>
                  </div>
                  <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                    <Clock className="w-5 h-5" />
                    <span className="text-2xl font-bold">{timeLeft}s</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>

              {/* Question */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {currentQuestion.question}
                </h2>

                <div className="grid gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={showFeedback}
                      className={`p-6 text-left rounded-2xl border-2 transition-all duration-200 ${getAnswerButtonClass(index)}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">{option}</span>
                        {showFeedback && index === currentQuestion.correctAnswer && (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        {showFeedback && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-semibold">
                        {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
                      </span>
                    </div>
                    {selectedAnswer !== currentQuestion.correctAnswer && (
                      <p className="mt-2 text-gray-600">
                        The correct answer was: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Your Score */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-6 h-6 text-orange-500" />
                  <h3 className="text-lg font-bold text-gray-900">Your Score</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {score.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </motion.div>

              {/* Players */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-6 h-6 text-orange-500" />
                  <h3 className="text-lg font-bold text-gray-900">Players</h3>
                </div>
                <div className="space-y-3">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {player.nickname.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {player.nickname}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {player.nickname === 'You' ? score : player.score}
                        </div>
                        <div className={`text-xs ${player.answered ? 'text-green-600' : 'text-gray-400'}`}>
                          {player.answered ? 'Answered' : 'Thinking...'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Game Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-orange-50 rounded-2xl p-4"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-gray-900">Game Progress</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Question {currentQuestionIndex + 1} of {sampleQuestions.length}</p>
                  <p>Time remaining: {timeLeft}s</p>
                  <p>Category: {currentQuestion.category}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}