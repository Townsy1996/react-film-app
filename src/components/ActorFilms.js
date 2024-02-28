import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ActorFilms({ actorId, onClose }) { 
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

        fetchFilmsByActorId();
    }, [actorId]);

    return (
        <div className="overlay"> 
            <div className="overlay-content"> 
                <button onClick={onClose}>Close</button> 
                {loading ? (
                    <div>Loading films...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <div>
                        <h2>Films Starring this Actor</h2>
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
