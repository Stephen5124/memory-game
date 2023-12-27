import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';
import Card from './Card';
import '../styles/GameBoard.scss';

function Popup({ onSave, onCancel }) {
  const [initials, setInitials] = useState(["", "", ""]);

  const handleInputChange = (index, value) => {
    const newInitials = [...initials];
    newInitials[index] = value.toUpperCase();
    setInitials(newInitials);
  };

  const handleSave = () => {
    if (initials.every(char => char.length === 1)) {
      onSave(initials.join(""));
    } else {
      alert("Please enter three letters.");
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>Enter name:</h3>
        <div className="initials-inputs">
          {initials.map((char, index) => (
            <input 
              key={index}
              type="text" 
              value={char} 
              onChange={e => handleInputChange(index, e.target.value)} 
              maxLength="1"
              className="initial-input"
            />
          ))}
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function GameBoard() {
  const { gameState, setGameState } = useGameState();
  const { cards, flippedCards, matchedCards, isGameWon, attempts } = gameState;
  // const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const sortedLeaderboard = [...leaderboard].sort((a, b) => a.attempts - b.attempts).slice(0, 10);

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

  // const goToSettings = () => {
  //   navigate('/settings');
  // };

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
    setIsShuffling(true);
    const shuffledCards = shuffleCards([...Array(15).keys()].flatMap(i => [i, i]));
    setGameState({
      cards: shuffledCards,
      flippedCards: [],
      matchedCards: [],
      isGameWon: false,
      attempts: 0
    });

    setShuffleKey(prevKey => prevKey + 1);
    setTimeout(() => setIsShuffling(false), 1000);
  }, [setGameState, shuffleCards]);

  useEffect(() => {
    resetGame();
  }, [resetGame, setGameState]);

  const handleCardClick = (cardId) => {
    if (isShuffling || flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
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
    if (isGameWon) {
      setShowPopup(true);
    }
  }, [isGameWon]);

  const handlePopupSave = (initials) => {
    const newEntry = { initials, attempts: attempts, date: new Date().toLocaleString() };
    const updatedLeaderboard = [...leaderboard, newEntry];
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
    setShowPopup(false);
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
    resetGame();
  }, [resetGame]);  

  return (
    <div className="game-container">
       {showPopup && (
        <Popup onSave={handlePopupSave} onCancel={handlePopupCancel} />
      )}
      <div className="sidebar">
        <button className="reset-button" onClick={resetGame}>
          Restart Game
        </button>
        {/* <button className="settings-button" onClick={goToSettings}>
          Settings
        </button> */}
        <div className="attempts-counter">
          <p>Attempts: {attempts}</p>
        </div>
        <div className="leaderboard">
          <h3>Leaderboard</h3>
          <ol>
            {sortedLeaderboard.map((entry, index) => (
              <li key={index}>{`${index + 1}. ${entry.initials}: ${entry.attempts} attempts, ${entry.date}`}</li>
            ))}
          </ol>
        </div>
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
