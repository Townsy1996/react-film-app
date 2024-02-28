import React from 'react';
import axios from 'axios';

function ActorDelete({ actorId, onDelete }) {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://16.171.0.136:8080/actor/delete/${actorId}`);
            onDelete(actorId); 
        } catch (error) {
           
            console.error('Error deleting actor:', error);
        }
    };

    return (
        <button onClick={handleDelete}>Delete</button>
    );
}

export default ActorDelete;
