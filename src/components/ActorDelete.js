import React, { useState } from 'react';
import axios from 'axios';

function ActorDelete({ actorId, onDelete }) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = async () => {
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://16.171.0.136:8080/actor/delete/${actorId}`);
            onDelete(actorId);
            setShowConfirmation(false);
        } catch (error) {
            console.error('Error deleting actor:', error);
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };

    /* Delete actor button, after click conformation window appears */

    return (
        <>


            <button id='delete-button' onClick={handleDelete}>Delete Actor</button>
            {showConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-dialog">
                        <p className="confirmation-message">Are you sure you want to delete?</p>
                        <div className="confirmation-buttons">
                            <button onClick={confirmDelete}>Yes, I am sure</button>
                            <button onClick={cancelDelete}>No, cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ActorDelete;
