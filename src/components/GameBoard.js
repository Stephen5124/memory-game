import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import '../styles/GameBoard.scss';

function GameBoard() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(true);
  const [resetCount, setResetCount] = useState(0);

  // Extend the colors array to include enough colors for all pairs
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

  // Fisher-Yates Shuffle Algorithm
  const shuffleCards = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  // Memoize resetGame using useCallback
  const resetGame = useCallback(() => {
    setIsShuffling(true);
    setFlippedCards([]);
    setMatchedCards([]);
    setCards(shuffleCards([...Array(30).keys()].flatMap(i => [i, i])));

    const shuffleDuration = 60 * 50; // Adjust based on your animation
    setTimeout(() => {
      setIsShuffling(false);
    }, shuffleDuration);
    setResetCount(count => count + 1);
  }, []); // Empty dependency array means the function is created only once

  // Shuffle cards on component mount
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleCardClick = (cardId) => {
    if (isShuffling || flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return; // Ignore clicks under certain conditions
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const match = cards[newFlippedCards[0]] === cards[newFlippedCards[1]]; // Check if the flipped cards match
      if (match) {
        setMatchedCards([...matchedCards, ...newFlippedCards]);
      }
      setTimeout(() => {
        setFlippedCards([]); // Reset flipped cards
      }, 1000);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2 && !matchedCards.includes(flippedCards[0]) && !matchedCards.includes(flippedCards[1])) {
      setTimeout(() => {
        setFlippedCards([]); // Reset flipped cards if not a match
      }, 1000);
    }
  }, [flippedCards, matchedCards, cards]);

  return (
    <div>
      <button onClick={resetGame} disabled={isShuffling}>Reset Game</button>
      <div className="game-board">
        {cards.map((card, idx) => (
          <div 
            key={`${resetCount}-${idx}`}
            style={{ '--card-index': idx }}
            className="card-container"
          >
            <Card 
              id={idx}
              value={card}
              color={matchedCards.includes(idx) ? cardColors[cards[idx]] : null} // Apply the color if the card is matched
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
