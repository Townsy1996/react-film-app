import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActorForm from './ActorForm'; // Assuming the ActorForm component is in the same directory

function ActorList() {
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                            <li key={actor.id}>{actor.firstName} {actor.lastName}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ActorList;
