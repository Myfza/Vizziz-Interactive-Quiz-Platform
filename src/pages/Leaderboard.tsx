import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star,
  Users,
  Target,
  Clock,
  Filter,
  Crown,
  Zap
} from 'lucide-react';
import { Layout } from '../components/Layout';

interface LeaderboardEntry {
  playerName: string;
  score: number;
  accuracy: number;
  category: string;
  difficulty: string;
  questionsAnswered: number;
  totalTime: number;
  timestamp: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '🏆' },
  { id: 'Science', name: 'Science', icon: '🔬' },
  { id: 'History', name: 'History', icon: '📚' },
  { id: 'Geography', name: 'Geography', icon: '🌍' },
  { id: 'Sports', name: 'Sports', icon: '⚽' },
  { id: 'Entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'Literature', name: 'Literature', icon: '📖' },
  { id: 'Technology', name: 'Technology', icon: '💻' },
  { id: 'Art', name: 'Art', icon: '🎨' }
];

export function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Load leaderboard data from localStorage - only completed quizzes
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    setLeaderboardData(results);
  }, []);

  const filteredData = leaderboardData
    .filter(entry => selectedCategory === 'all' || entry.category === selectedCategory)
    .filter(entry => selectedDifficulty === 'all' || entry.difficulty === selectedDifficulty)
    .sort((a, b) => {
      // Sort by accuracy first, then by score
      if (b.accuracy !== a.accuracy) {
        return b.accuracy - a.accuracy;
      }
      return b.score - a.score;
    })
    .slice(0, 50);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return (
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-sm">{rank}</span>
          </div>
        );
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-orange-500';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-500';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-full px-4 py-2 mb-4">
            <Trophy className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">Global Rankings</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-600">
            See how you rank against players worldwide
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Filter className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Results
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Top Players
            </h2>
            <div className="text-sm text-gray-500">
              Showing top {filteredData.length} players
            </div>
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No results found</p>
              <p className="text-gray-400">Complete a quiz to see your score here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-200">
                <div className="col-span-1">Rank</div>
                <div className="col-span-3">Player</div>
                <div className="col-span-2">Score</div>
                <div className="col-span-2">Accuracy</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Difficulty</div>
                <div className="col-span-1">Time</div>
              </div>

              {/* Leaderboard Entries */}
              {filteredData.map((entry, index) => (
                <motion.div
                  key={`${entry.playerName}-${entry.timestamp}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-2xl border-2 transition-all hover:shadow-lg ${
                    index < 3
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="md:col-span-1 flex items-center justify-center md:justify-start">
                      {getRankIcon(index + 1)}
                    </div>

                    {/* Player Info */}
                    <div className="md:col-span-3 text-center md:text-left">
                      <div className="font-bold text-lg text-gray-900">
                        {entry.playerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="md:col-span-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start space-x-1">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-2xl font-bold text-gray-900">
                          {entry.score.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">points</div>
                    </div>

                    {/* Accuracy */}
                    <div className="md:col-span-2 text-center md:text-left">
                      <div className={`text-xl font-bold ${getAccuracyColor(entry.accuracy)}`}>
                        {entry.accuracy}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((entry.accuracy / 100) * entry.questionsAnswered)}/{entry.questionsAnswered} correct
                      </div>
                    </div>

                    {/* Category */}
                    <div className="md:col-span-2 text-center md:text-left">
                      <div className="inline-flex items-center space-x-1 bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full text-sm">
                        <span>{CATEGORIES.find(c => c.id === entry.category)?.icon || '📝'}</span>
                        <span className="capitalize">{entry.category}</span>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="md:col-span-1 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.difficulty === 'hard'
                          ? 'bg-red-100 text-red-800'
                          : entry.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {entry.difficulty.toUpperCase()}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="md:col-span-1 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {formatTime(entry.totalTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <Trophy className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {filteredData.length > 0 ? filteredData[0].score.toLocaleString() : '0'}
            </div>
            <div className="text-gray-600">Highest Score</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <Star className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {filteredData.length > 0 ? Math.max(...filteredData.map(e => e.accuracy)) : 0}%
            </div>
            <div className="text-gray-600">Best Accuracy</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {filteredData.length}
            </div>
            <div className="text-gray-600">Total Players</div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}