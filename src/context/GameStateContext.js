// src/GameStateContext.js
import React, { createContext, useState, useContext } from 'react';

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    // Define the initial game state here
    cards: [],
    flippedCards: [],
    matchedCards: [],
    isGameWon: false,
    attempts: 0,
    // Add other game state properties as needed
  });

  // Add any functions that manipulate the state here, if necessary

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};
