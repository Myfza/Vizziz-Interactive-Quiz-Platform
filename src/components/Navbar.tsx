import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Menu,
  X,
  Trophy,
  Play,
  Users
} from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/Logo-vizziz.png" 
              alt="Vizziz" 
              className="h-20 w-auto"
              onError={(e) => {
                // Fallback to text if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'inline';
              }}
            />
            <span className="text-xl font-bold logo-text hidden">Vizziz</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/play"
              className="flex items-center space-x-2 btn-primary"
            >
              <Play className="w-4 h-4" />
              <span>Play Now</span>
            </Link>
            <Link
              to="/join"
              className="flex items-center space-x-2 text-gray-700 hover:text-vizziz-primary transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Join Game</span>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-vizziz-primary transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-2xl hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <div className="space-y-4">
              <Link
                to="/play"
                className="block text-gray-700 hover:text-vizziz-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Play Now
              </Link>
              <Link
                to="/join"
                className="block text-gray-700 hover:text-vizziz-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Game
              </Link>
              <Link
                to="/leaderboard"
                className="block text-gray-700 hover:text-vizziz-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}