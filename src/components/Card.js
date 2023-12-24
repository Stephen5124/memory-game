import React from 'react';
import '../styles/Card.scss';

function Card({ id, isFlipped, onCardClick, value, color }) {
  // Function to generate pixel elements for the space invader
  const renderPixels = () => {
    const pixels = [];
    const pixelPositions = [
      // Add the positions of your pixels here
      { top: '10px', left: '20px' },
      { top: '10px', left: '30px' },
      { top: '20px', left: '10px' },
      { top: '20px', left: '40px' },
      // ... More pixel positions ...
    ];

    pixelPositions.forEach((pos, index) => {
      pixels.push(
        <div
          key={index}
          className="pixel"
          style={{ top: pos.top, left: pos.left }}
        ></div>
      );
    });

    return pixels;
  };

  return (
    <div className={`card-container ${isFlipped ? 'flipped' : ''}`} onClick={() => onCardClick(id)}>
      <div className="card-front" style={{ backgroundColor: color }}>
        Front {value}
      </div>
      <div className="card-back">
        {/* Render the space invader pixel art */}
        <div className="space-invader">
          {renderPixels()}
        </div>
      </div>
    </div>
  );
}

export default Card;
  