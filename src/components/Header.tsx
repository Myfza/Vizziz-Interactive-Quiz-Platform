import React from 'react';
import { Trophy, ArrowLeft, Brain } from 'lucide-react';

interface HeaderProps {
  currentState: string;
  onShowLeaderboard: () => void;
  onReturnToConfig: () => void;
}

export function Header({ currentState, onShowLeaderboard, onReturnToConfig }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">QuizMaster</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentState === 'leaderboard' && (
              <button
                onClick={onReturnToConfig}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            
            {currentState === 'config' && (
              <button
                onClick={onShowLeaderboard}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </button>
            )}
            
            {(currentState === 'results' || currentState === 'quiz') && (
              <button
                onClick={onReturnToConfig}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>New Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}