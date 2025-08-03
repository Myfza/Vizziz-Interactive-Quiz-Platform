import React, { useState } from 'react';
import { Trophy, Clock, Target, Share2, RotateCcw, TrendingUp } from 'lucide-react';
import { QuizResult } from '../types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  onReturnToConfig: () => void;
  onShowLeaderboard: () => void;
}

export function QuizResults({ result, onReturnToConfig, onShowLeaderboard }: QuizResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = () => {
    if (result.percentage >= 80) return 'text-green-600';
    if (result.percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (result.percentage >= 90) return 'Excellent!';
    if (result.percentage >= 80) return 'Great job!';
    if (result.percentage >= 70) return 'Good work!';
    if (result.percentage >= 60) return 'Not bad!';
    return 'Keep practicing!';
  };

  const shareResult = async () => {
    const shareText = `I just scored ${result.percentage}% on a ${result.difficulty} quiz! 🎯 Can you beat my score?`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuizMaster Result',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Result copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy to clipboard');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className={`w-16 h-16 ${getScoreColor()}`} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600">{getScoreMessage()}</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className={`text-3xl font-bold ${getScoreColor()}`}>
              {result.percentage}%
            </div>
            <p className="text-gray-600">Score</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-xl">
            <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-green-600">
              {result.score}/{result.totalQuestions}
            </div>
            <p className="text-gray-600">Correct</p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-3xl font-bold text-purple-600">
              {formatTime(result.timeSpent)}
            </div>
            <p className="text-gray-600">Time</p>
          </div>
        </div>

        {/* Quiz Details */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 font-medium">{result.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Difficulty:</span>
              <span className="ml-2 font-medium capitalize">{result.difficulty}</span>
            </div>
            <div>
              <span className="text-gray-600">Player:</span>
              <span className="ml-2 font-medium">{result.playerName}</span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2 font-medium">
                {new Date(result.completedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Question Details */}
        <div className="mb-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{showDetails ? 'Hide' : 'Show'} Question Details</span>
          </button>

          {showDetails && (
            <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
              {result.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    answer.isCorrect
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        {answer.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: <span className="font-medium">{answer.selectedAnswer}</span>
                      </p>
                      {!answer.isCorrect && (
                        <p className="text-sm text-gray-600">
                          Correct answer: <span className="font-medium">{answer.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {answer.timeSpent}s
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={shareResult}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Result</span>
          </button>

          <button
            onClick={onShowLeaderboard}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            <span>View Leaderboard</span>
          </button>

          <button
            onClick={onReturnToConfig}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}