import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddActorFilm from './AddActorFilm';

function ActorFilms({ actorId, onClose }) {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFilmsByActorId = async () => {
        try {
            const response = await axios.get(`http://16.171.0.136:8080/film/getByActorId/${actorId}`);
            setFilms(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilmsByActorId();
    }, [actorId]);

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="overlay" onClick={handleClose}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose}>Close</button>
                <AddActorFilm actorId={actorId} onUpdate={fetchFilmsByActorId} />
                {loading ? (
                    <div>Loading films...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <div>
                        <h2>Films Starring this Actor:</h2>
                        <ul>
                            {films.map(film => (
                                <li key={film.filmId}>{film.title}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ActorFilms;

