import React from 'react';

function FilmOverlay({ film, onClose }) {
  const handleClose = (e) => {
    
    e.stopPropagation();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-content" onClick={handleClose}>
        <h2>{film.title}</h2>
        <p>{film.description}</p>
        <p>Release Year: {film.releaseYear}</p>
        <p>Rating: {film.rating}</p>
        <p>Runtime: {film.runTime} minutes</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default FilmOverlay;
