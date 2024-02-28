import React, { useState } from 'react';
import axios from 'axios';

function ActorForm({ onAddActor }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post('http://16.171.0.136:8080/actor/create', {
                firstName, lastName
            });

            onAddActor(response.data);
            setFirstName('');
            setLastName('');
            setFormVisible(false);
        } catch (error) {
            
            setError(error.message);
        }
    };

    const toggleFormVisibility = () => {
        setFormVisible(!formVisible);
    };

    return (
        <div id="actor-form-container">
            <button onClick={toggleFormVisibility}>Add Actor</button>
            {formVisible && (
                <div>
                    <h2>Add Actor</h2>
                    {error && <div id="error-message">Error: {error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="firstName">First Name:</label>
                            <input type="text" id="firstName" value={firstName} onChange={(e) =>
                                setFirstName(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" id="lastName" value={lastName} onChange={(e) =>
                                setLastName(e.target.value)} required />
                        </div>
                        <button id='add-actor-button' type="submit">Add Actor</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ActorForm;
