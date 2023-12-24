// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameStateProvider } from './context/GameStateContext';
import GameBoard from './components/GameBoard';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import './App.css';

function App() {
  return (
    <Router>
      <GameStateProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<GameBoard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </GameStateProvider>
    </Router>
  );
}

export default App;
