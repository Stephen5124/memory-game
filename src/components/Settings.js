// src/components/Settings.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';

function Settings() {
  const navigate = useNavigate();
  const { gameState, setGameState } = useGameState();

  const handleDifficultyChange = (newDifficulty) => {
    setGameState({ ...gameState, difficulty: newDifficulty });
  };

  const goBackToGame = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Settings</h2>
      <button onClick={() => handleDifficultyChange('easy')}>Easy</button>
      <button onClick={() => handleDifficultyChange('hard')}>Hard</button>
      <button className="back-button" onClick={goBackToGame}>Back to Game</button>
      {/* Other settings content goes here */}
    </div>
  );
}

export default Settings;
