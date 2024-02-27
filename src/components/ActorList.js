import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    const chunkArray = (arr, size) => {
        return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
            arr.slice(i * size, i * size + size)
        );
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
                    <div id="actor-list">
                        {chunkArray(actors, 4).map((row, index) => (
                            <div className="actor-row" key={index}>
                                {row.map(actor => (
                                    <div className="actor" key={actor.id}>
                                        {actor.firstName} {actor.lastName}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ActorList;
