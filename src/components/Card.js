import React from 'react';
import '../styles/Card.scss';

function Card({ id, isFlipped, onCardClick, value, color }) {
  return (
    <div className={`card-container ${isFlipped ? 'flipped' : ''}`} onClick={() => onCardClick(id)}>
      <div className="card-front" style={{ backgroundColor: color }}>
        Front {value}
      </div>
      <div className="card-back">
        Back
      </div>
    </div>
  );
}

export default Card;
