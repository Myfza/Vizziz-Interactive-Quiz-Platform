import React, { useState } from 'react';
import { Trophy, Medal, Award, Trash2, Filter } from 'lucide-react';
import { getLeaderboard, clearLeaderboard } from '../utils/storage';
import { LeaderboardEntry } from '../types/quiz';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries] = useState<LeaderboardEntry[]>(getLeaderboard());
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredEntries = entries.filter(entry => 
    filter === 'all' || entry.difficulty === filter
  );

  const handleClearLeaderboard = () => {
    if (window.confirm('Are you sure you want to clear the leaderboard? This action cannot be undone.')) {
      clearLeaderboard();
      window.location.reload();
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{index + 1}</span>;
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h2>
          <p className="text-gray-600">Top quiz performers</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No quiz results yet!</p>
            <p className="text-gray-400">Complete a quiz to see your score here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  index < 3
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getRankIcon(index)}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{entry.playerName}</h3>
                      <p className="text-sm text-gray-600">{entry.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getPercentageColor(entry.percentage)}`}>
                        {entry.percentage}%
                      </div>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        {entry.score}/{entry.totalQuestions}
                      </div>
                      <p className="text-xs text-gray-500">Correct</p>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-600 capitalize">
                        {entry.difficulty}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Quiz
          </button>
          
          {entries.length > 0 && (
            <button
              onClick={handleClearLeaderboard}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Leaderboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}