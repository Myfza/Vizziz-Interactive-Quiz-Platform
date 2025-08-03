import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { Home } from './pages/Home';
import PlayNow from './pages/PlayNow';
import { Leaderboard } from './pages/Leaderboard';
import { JoinGame } from './pages/JoinGame';
import GameLobby from './pages/GameLobby';
import PlayQuiz from './pages/PlayQuiz';
import GameResults from './pages/GameResults';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<PlayNow />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/join" element={<JoinGame />} />
        <Route path="/lobby/:gameCode" element={<GameLobby />} />
        <Route path="/play/:sessionId" element={<PlayQuiz />} />
        <Route path="/results/:sessionId" element={<GameResults />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;