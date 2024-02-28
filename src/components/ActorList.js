import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActorForm from './ActorForm';
import ActorDelete from './ActorDelete';
import ActorFilms from './ActorFilms';
import ActorUpdate from './ActorUpdate'; 

function ActorList() {
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedActorId, setSelectedActorId] = useState(null);
    const [isActorFilmsVisible, setIsActorFilmsVisible] = useState(false); 

    useEffect(() => {
        const fetchActors = async () => {
            try {
                const response = await axios.get('http://16.171.0.136:8080/actor/getAll');
                setActors(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchActors();
    }, []);

    const handleAddActor = (newActor) => {
        setActors([...actors, newActor]);
    };

    const handleDeleteActor = (actorId) => {
        setActors(actors.filter(actor => actor.actorId !== actorId));
        if (selectedActorId === actorId) {
            setSelectedActorId(null);
            setIsActorFilmsVisible(false); 
        }
    };

    const handleActorClick = (actorId, event) => {
        event.stopPropagation(); 
        setSelectedActorId(actorId);
        setIsActorFilmsVisible(true); 
    };

    const handleCloseActorFilms = () => {
        setIsActorFilmsVisible(false); 
    };

    const handleActorUpdate = (updatedActor) => {
        setActors(actors.map(actor => actor.actorId === updatedActor.actorId ? updatedActor : actor));
    };

    return (
        <div id="actor-list-container">
            {loading ? (
                <div id="loading-message">Loading...</div>
            ) : error ? (
                <div id="error-message">Error: {error}</div>
            ) : (
                <div>
                    <h1 id="star-list-heading">Star List</h1>
                    <ActorForm onAddActor={handleAddActor} />
                    <ul id="actor-list">
                        {actors.map(actor => (
                            <li key={actor.actorId} onClick={(event) => handleActorClick(actor.actorId, event)}>
                                {actor.firstName} {actor.lastName}
                                <ActorDelete actorId={actor.actorId} onDelete={handleDeleteActor} />
                                <ActorUpdate actorId={actor.actorId} onUpdate={handleActorUpdate} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {isActorFilmsVisible && (
                <ActorFilms actorId={selectedActorId} onClose={handleCloseActorFilms} />
            )}
        </div>
    );
}

export default ActorList;
