import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameBoard from './components/GameBoard'; // Import the GameBoard component
import Settings from './components/Settings'; // Assuming you have a Settings component
import Leaderboard from './components/Leaderboard'; // Assuming you have a Leaderboard component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GameBoard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
