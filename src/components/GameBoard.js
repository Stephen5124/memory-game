import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import '../styles/GameBoard.scss';

function GameBoard() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(true);
  const [resetCount, setResetCount] = useState(0);
  const [attempts, setAttempts] = useState(0); 
  const [isGameWon, setIsGameWon] = useState(false);

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

  const shuffleCards = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const resetGame = useCallback(() => {
    setIsShuffling(true);
    setFlippedCards([]);
    setMatchedCards([]);
    setIsGameWon(false); // Also reset the win state
    setAttempts(0); // Reset attempts
    setCards(shuffleCards([...Array(15).keys()].flatMap(i => [i, i])));

    const shuffleDuration = 60 * 50;
    setTimeout(() => {
      setIsShuffling(false);
    }, shuffleDuration);
    setResetCount(count => count + 1);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleCardClick = (cardId) => {
    if (isShuffling || flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    if (flippedCards.length === 0) {
      setAttempts(prevAttempts => prevAttempts + 1); // Increment attempts for each new pair attempt
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const match = cards[newFlippedCards[0]] === cards[newFlippedCards[1]];
      if (match) {
        const newMatchedCards = [...matchedCards, ...newFlippedCards];
        setMatchedCards(newMatchedCards);
        // Use newMatchedCards.length here, since setMatchedCards is async
        if (newMatchedCards.length === cards.length) {
          setIsGameWon(true); // Update the state to reflect the win
        }
      }
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2 && !matchedCards.includes(flippedCards[0]) && !matchedCards.includes(flippedCards[1])) {
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, matchedCards, cards]);

  return (
    <div>
      <button onClick={resetGame} disabled={isShuffling}>Reset Game</button>
      <p>Attempts: {attempts}</p>
      {/* Add the conditional class name based on the isGameWon state */}
      <div className={`game-board ${isGameWon ? 'win-animation' : ''}`}> 
        {cards.map((card, idx) => (
          <div 
            key={`${resetCount}-${idx}`}
            style={{ '--card-index': idx }}
            className={`card-container ${isGameWon ? 'win-animation' : ''}`} // Apply win animation to each card if needed
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
  );  
}

export default GameBoard;