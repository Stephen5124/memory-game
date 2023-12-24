import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';
import Card from './Card';
import '../styles/GameBoard.scss';

function GameBoard() {
  const { gameState, setGameState } = useGameState();
  const { cards, flippedCards, matchedCards, isGameWon, attempts } = gameState;
  const navigate = useNavigate();

  const [shuffleKey, setShuffleKey] = useState(0); // State to force re-render on shuffle
  const [isShuffling, setIsShuffling] = useState(false); // State to track shuffling status

  const colors = [
    "red", "green", "blue", "yellow", "orange", "purple", 
    "cyan", "magenta", "lime", "pink", "teal", "maroon", 
    "olive", "navy", "gray", "silver", "gold", "beige", 
    "brown", "coral", "turquoise", "violet", "indigo", 
    "mint", "peach", "lavender", "charcoal", "amber", 
    "emerald", "plum"
  ];

  const cardColors = {};
  colors.forEach((color, index) => {
    cardColors[index] = color;
  });

  const goToSettings = () => {
    navigate('/settings');
  };

  const shuffleCards = useCallback((array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }, []);

  const resetGame = useCallback(() => {
    setIsShuffling(true); // Enable shuffling state
    const shuffledCards = shuffleCards([...Array(15).keys()].flatMap(i => [i, i]));
    setGameState({
      cards: shuffledCards,
      flippedCards: [],
      matchedCards: [],
      isGameWon: false,
      attempts: 0
    });

    setShuffleKey(prevKey => prevKey + 1); // Increment key to trigger re-render
    setTimeout(() => setIsShuffling(false), 1000); // Disable shuffling state after animation
  }, [setGameState, shuffleCards]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleCardClick = (cardId) => {
    if (isShuffling || flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return; // Ignore clicks if shuffling or if other conditions are met
    }

    if (flippedCards.length === 0) {
      setGameState(prevState => ({
        ...prevState,
        attempts: prevState.attempts + 1
      }));
    }

    const newFlippedCards = [...flippedCards, cardId];
    setGameState(prevState => ({
      ...prevState,
      flippedCards: newFlippedCards
    }));

    if (newFlippedCards.length === 2) {
      const match = cards[newFlippedCards[0]] === cards[newFlippedCards[1]];
      if (match) {
        const newMatchedCards = [...matchedCards, ...newFlippedCards];
        setGameState(prevState => ({
          ...prevState,
          matchedCards: newMatchedCards
        }));
        if (newMatchedCards.length === cards.length) {
          setGameState(prevState => ({
            ...prevState,
            isGameWon: true
          }));
        }
      }
      setTimeout(() => {
        setGameState(prevState => ({
          ...prevState,
          flippedCards: []
        }));
      }, 1000);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2 && !matchedCards.includes(flippedCards[0]) && !matchedCards.includes(flippedCards[1])) {
      setTimeout(() => {
        setGameState(prevState => ({
          ...prevState,
          flippedCards: []
        }));
      }, 1000);
    }
  }, [flippedCards, matchedCards, setGameState]);

  return (
    <div className="game-container">
      <div className="sidebar">
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
        <button className="settings-button" onClick={goToSettings}>
          Settings
        </button>
        <p>Attempts: {attempts}</p>
      </div>
      <div className="cards-container">
        <div key={shuffleKey} className={`game-board ${isGameWon ? 'win-animation' : ''}`}>
          {cards.map((card, idx) => (
            <div 
              key={`${idx}`}
              style={{ '--card-index': idx }}
              className="card-container"
            >
              <Card 
                id={idx}
                value={card}
                color={matchedCards.includes(idx) ? cardColors[cards[idx]] : null}
                isFlipped={flippedCards.includes(idx) || matchedCards.includes(idx)}
                onCardClick={() => handleCardClick(idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
