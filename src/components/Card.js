import React from 'react';
import '../styles/Card.scss';

function Card({ id, isFlipped, onCardClick, value }) {
  return (
    <div className={`card-container ${isFlipped ? 'flipped' : ''}`} onClick={() => onCardClick(id)}>
      <div className="card-front">
        {/* You might eventually want to display something based on the card's value */}
        Front {value}
      </div>
      <div className="card-back">
        Back
      </div>
    </div>
  );
}

export default Card;
