import React, { useState } from 'react';
import axios from 'axios';

function AddActorFilm({ filmId, onUpdate }) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddFilm = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`http://16.171.0.136:8080/film/updateActorFilms/${filmId}`, {
                actorId: filmId 
            });
            setLoading(false);
            onUpdate();
        } catch (error) {
            console.error('Error updating films:', error);
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleAddFilm();
    };

    return (
        <div>
            <button onClick={() => setShowForm(true)}>Add Film</button>
            {showForm && (
                <form onSubmit={handleFormSubmit}>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default AddActorFilm;
