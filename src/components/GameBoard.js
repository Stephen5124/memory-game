import React, { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/GameBoard.scss';

function GameBoard() {
  const [flippedCards, setFlippedCards] = useState([]);

  const handleCardClick = (cardId) => {
    if (flippedCards.length < 2 && !flippedCards.includes(cardId)) {
      setFlippedCards([...flippedCards, cardId]);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setTimeout(() => {
        setFlippedCards([]);
      }, 3000);
    }
  }, [flippedCards]);

  return (
    <div className="game-board">
      {Array.from({ length: 24 }).map((_, idx) => (
        <Card 
          key={idx}
          id={idx}
          isFlipped={flippedCards.includes(idx)}
          onCardClick={() => handleCardClick(idx)}
        />
      ))}
    </div>
  );
}

export default GameBoard;
