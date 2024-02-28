// ActorUpdate.js
import React, { useState } from 'react';
import axios from 'axios';

function ActorUpdate({ actorId, onUpdate }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`http://16.171.0.136:8080/actor/update/${actorId}`, {
                firstName,
                lastName
            });
            onUpdate(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleFormClick = (e) => {
        // Prevent click event propagation to the parent elements
        e.stopPropagation();
    };

    return (
        <div onClick={handleFormClick}> {/* Add onClick handler to prevent click propagation */}
            {expanded ? (
                <div>
                    <h2>Update Actor Details</h2>
                    <div>
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <button onClick={handleUpdate} disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                    {error && <div>Error: {error}</div>}
                </div>
            ) : (
                <button onClick={() => setExpanded(true)}>Update</button>
            )}
        </div>
    );
}

export default ActorUpdate;
