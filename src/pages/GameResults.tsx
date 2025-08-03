import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star,
  Clock,
  Target,
  Users,
  Share2,
  Home,
  RotateCcw,
  Crown
} from 'lucide-react';
import { Layout } from '../components/Layout';

interface PlayerResult {
  id: string;
  nickname: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  rank: number;
}

// Sample results data
const sampleResults: PlayerResult[] = [
  {
    id: '1',
    nickname: 'You',
    score: 2500,
    accuracy: 85,
    timeSpent: 45,
    rank: 2
  },
  {
    id: '2',
    nickname: 'Alice',
    score: 2800,
    accuracy: 90,
    timeSpent: 42,
    rank: 1
  },
  {
    id: '3',
    nickname: 'Bob',
    score: 2200,
    accuracy: 75,
    timeSpent: 52,
    rank: 3
  },
  {
    id: '4',
    nickname: 'Charlie',
    score: 1900,
    accuracy: 65,
    timeSpent: 58,
    rank: 4
  }
];

export default function GameResults() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const playerResult = sampleResults.find(r => r.nickname === 'You');
  const sortedResults = [...sampleResults].sort((a, b) => a.rank - b.rank);

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

  const getScoreColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (rank: number) => {
    switch (rank) {
      case 1:
        return 'Congratulations! You won! 🎉';
      case 2:
        return 'Great job! Second place! 🥈';
      case 3:
        return 'Well done! Third place! 🥉';
      default:
        return 'Good effort! Keep practicing! 💪';
    }
  };

  const shareResult = async () => {
    const shareText = `I just finished a quiz and ranked #${playerResult?.rank}! 🎯 Can you beat my score of ${playerResult?.score} points?`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vizziz Quiz Result',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
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
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              {getRankIcon(playerResult?.rank || 4)}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
            <p className="text-xl text-gray-600">
              {getScoreMessage(playerResult?.rank || 4)}
            </p>
          </motion.div>

          {/* Your Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <Trophy className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-600">
                  #{playerResult?.rank}
                </div>
                <p className="text-gray-600">Rank</p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">
                  {playerResult?.score.toLocaleString()}
                </div>
                <p className="text-gray-600">Score</p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className={`text-3xl font-bold ${getScoreColor(playerResult?.accuracy || 0)}`}>
                  {playerResult?.accuracy}%
                </div>
                <p className="text-gray-600">Accuracy</p>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-purple-600">
                  {formatTime(playerResult?.timeSpent || 0)}
                </div>
                <p className="text-gray-600">Time</p>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Final Rankings</h2>
              <Users className="w-6 h-6 text-orange-500" />
            </div>

            <div className="space-y-4">
              {sortedResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    result.nickname === 'You'
                      ? 'bg-orange-50 border-orange-200'
                      : index < 3
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getRankIcon(result.rank)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-gray-900">
                            {result.nickname}
                          </span>
                          {result.nickname === 'You' && (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.accuracy}% accuracy • {formatTime(result.timeSpent)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {result.score.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">points</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={shareResult}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Result</span>
            </button>

            <button
              onClick={() => navigate('/play')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}