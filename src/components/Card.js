import React from 'react';
import '../styles/Card.scss';

function Card({ id, isFlipped, onCardClick }) {
  return (
    <div className={`card-container ${isFlipped ? 'flipped' : ''}`} onClick={() => onCardClick(id)}>
      <div className="card-front">
        Front 
      </div>
      <div className="card-back">
        Back 
      </div>
    </div>
  );
}

export default Card;
