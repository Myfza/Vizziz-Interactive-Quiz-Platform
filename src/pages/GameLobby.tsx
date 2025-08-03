import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Copy, 
  Play, 
  Settings, 
  Crown,
  UserPlus,
  Clock,
  Hash
} from 'lucide-react';
import { Layout } from '../components/Layout';

interface Player {
  id: string;
  nickname: string;
  avatar?: string;
  isReady: boolean;
  isHost: boolean;
}

export default function GameLobby() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState<Player[]>([
    {
      id: '1',
      nickname: 'Host Player',
      isReady: true,
      isHost: true
    }
  ]);
  const [isHost] = useState(true); // For demo purposes
  const [gameSettings, setGameSettings] = useState({
    category: 'Science',
    difficulty: 'medium',
    questionCount: 10,
    timeLimit: 30
  });
  const [copied, setCopied] = useState(false);

  const copyGameCode = async () => {
    if (gameCode) {
      try {
        await navigator.clipboard.writeText(gameCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy game code');
      }
    }
  };

  const startGame = () => {
    // Navigate to quiz game with session ID
    navigate(`/play/${gameCode}`);
  };

  const addDemoPlayer = () => {
    const demoNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    const availableNames = demoNames.filter(name => 
      !players.some(player => player.nickname === name)
    );
    
    if (availableNames.length > 0) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        nickname: availableNames[0],
        isReady: Math.random() > 0.5,
        isHost: false
      };
      setPlayers([...players, newPlayer]);
    }
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
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
              <Hash className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">{gameCode}</span>
              <button
                onClick={copyGameCode}
                className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Copy game code"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-green-600 text-sm"
              >
                Game code copied to clipboard!
              </motion.p>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Game Lobby</h1>
            <p className="text-gray-600">Waiting for players to join...</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Players List */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-orange-500" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Players ({players.length})
                    </h2>
                  </div>
                  <button
                    onClick={addDemoPlayer}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Demo Player</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {players.map((player) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {player.nickname.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              {player.nickname}
                            </span>
                            {player.isHost && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <span className={`text-sm ${
                            player.isReady ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {player.isReady ? 'Ready' : 'Not Ready'}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`w-3 h-3 rounded-full ${
                        player.isReady ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Game Settings & Controls */}
            <div className="space-y-6">
              {/* Game Settings */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Settings className="w-6 h-6 text-orange-500" />
                  <h3 className="text-lg font-bold text-gray-900">Game Settings</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={gameSettings.category}
                      onChange={(e) => setGameSettings(prev => ({ ...prev, category: e.target.value }))}
                      disabled={!isHost}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={gameSettings.difficulty}
                      onChange={(e) => setGameSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                      disabled={!isHost}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Questions: {gameSettings.questionCount}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={gameSettings.questionCount}
                      onChange={(e) => setGameSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                      disabled={!isHost}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time per Question: {gameSettings.timeLimit}s
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={gameSettings.timeLimit}
                      onChange={(e) => setGameSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                      disabled={!isHost}
                      className="w-full"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Start Game Button */}
              {isHost && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="w-6 h-6" />
                  <span>Start Game</span>
                </motion.button>
              )}

              {/* Game Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-orange-50 rounded-2xl p-4"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-gray-900">Game Info</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Share the game code with friends</p>
                  <p>• Wait for all players to be ready</p>
                  <p>• Host can start the game anytime</p>
                  <p>• Everyone plays the same questions</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}