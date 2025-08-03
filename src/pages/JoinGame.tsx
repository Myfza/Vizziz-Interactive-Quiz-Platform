import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, Gamepad2, Hash } from 'lucide-react';
import { Layout } from '../components/Layout';

export function JoinGame() {
  const navigate = useNavigate();
  
  const [gameCode, setGameCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCode.trim() || !nickname.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Simulate joining game - in real implementation, this would check if game exists
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, always succeed and navigate to lobby
      navigate(`/lobby/${gameCode.toUpperCase()}`);
    } catch (err) {
      setError('Game not found or already started. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join a Game
            </h2>
            <p className="text-gray-600">
              Enter the game code to join a live quiz
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-4"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Code
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl font-bold tracking-widest"
                    placeholder="ABC123"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-character code from your host
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your nickname"
                  maxLength={20}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !gameCode.trim() || !nickname.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Joining Game...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Users className="w-5 h-5 mr-2" />
                    Join Game
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </button>
            </form>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-gray-600 text-sm">
              Don't have a game code? Ask your host to share it with you, or{' '}
              <button
                onClick={() => navigate('/play')}
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                create your own quiz
              </button>
            </p>
          </motion.div>

          {/* Recent Games */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Join
            </h3>
            <div className="space-y-3">
              {['ABC123', 'XYZ789', 'DEF456'].map((code, index) => (
                <button
                  key={code}
                  onClick={() => setGameCode(code)}
                  className="w-full p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Game {code}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Math.floor(Math.random() * 20) + 5} players waiting
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * These are demo games for testing purposes
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}