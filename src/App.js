import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Placeholder components
const GameBoard = () => <h2>Game Board</h2>;
const Settings = () => <h2>Settings</h2>;
const Leaderboard = () => <h2>Leaderboard</h2>;

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
