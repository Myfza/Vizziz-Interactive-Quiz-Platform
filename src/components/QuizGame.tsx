import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { QuizData, QuizSettings, QuizResult, QuizAnswer } from '../types/quiz';
import { decodeHtmlEntities } from '../utils/api';
import { getPlayerName } from '../utils/storage';

interface QuizGameProps {
  quizData: QuizData;
  settings: QuizSettings;
  onComplete: (result: QuizResult) => void;
}

export function QuizGame({ quizData, settings, onComplete }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [quizStartTime] = useState(Date.now());

  const question = quizData.results[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.results.length) * 100;

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setTimeLeft(settings.timeLimit);
  }, [currentQuestion, settings.timeLimit]);

  useEffect(() => {
    if (timeLeft <= 0 && !showFeedback) {
      handleAnswer('');
    }
  }, [timeLeft, showFeedback]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;

    const isCorrect = answer === question.correct_answer;
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    const newAnswer: QuizAnswer = {
      question: decodeHtmlEntities(question.question),
      selectedAnswer: answer || 'No answer',
      correctAnswer: question.correct_answer,
      isCorrect,
      timeSpent,
    };

    setAnswers([...answers, newAnswer]);
    setSelectedAnswer(answer);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < quizData.results.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setShowFeedback(false);
      } else {
        completeQuiz([...answers, newAnswer]);
      }
    }, 1500);
  };

  const completeQuiz = (finalAnswers: QuizAnswer[]) => {
    const correctAnswers = finalAnswers.filter(a => a.isCorrect).length;
    const totalTime = Math.round((Date.now() - quizStartTime) / 1000);
    const percentage = Math.round((correctAnswers / quizData.results.length) * 100);

    const result: QuizResult = {
      id: Date.now().toString(),
      playerName: getPlayerName(),
      score: correctAnswers,
      totalQuestions: quizData.results.length,
      percentage,
      timeSpent: totalTime,
      category: settings.category === 'any' ? 'Mixed' : question.category,
      difficulty: settings.difficulty,
      completedAt: new Date().toISOString(),
      answers: finalAnswers,
    };

    onComplete(result);
  };

  const getTimeColor = () => {
    if (timeLeft > settings.timeLimit * 0.5) return 'text-green-600';
    if (timeLeft > settings.timeLimit * 0.25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAnswerButtonClass = (answer: string) => {
    if (!showFeedback) {
      return 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300';
    }

    if (answer === question.correct_answer) {
      return 'bg-green-100 text-green-800 border-green-300';
    }

    if (answer === selectedAnswer && answer !== question.correct_answer) {
      return 'bg-red-100 text-red-800 border-red-300';
    }

    return 'bg-gray-100 text-gray-500 border-gray-300';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {quizData.results.length}
            </span>
            <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
              <Clock className="w-4 h-4" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {question.category}
            </span>
            <span className="text-sm font-medium text-gray-500 capitalize">
              {question.difficulty}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {decodeHtmlEntities(question.question)}
          </h2>
        </div>

        {/* Answers */}
        <div className="grid gap-4">
          {question.all_answers?.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(answer)}
              disabled={showFeedback}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${getAnswerButtonClass(answer)}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{decodeHtmlEntities(answer)}</span>
                {showFeedback && answer === question.correct_answer && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {showFeedback && answer === selectedAnswer && answer !== question.correct_answer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2">
              {selectedAnswer === question.correct_answer ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">
                {selectedAnswer === question.correct_answer ? 'Correct!' : 'Incorrect!'}
              </span>
            </div>
            {selectedAnswer !== question.correct_answer && (
              <p className="mt-2 text-sm text-gray-600">
                The correct answer was: <strong>{decodeHtmlEntities(question.correct_answer)}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}