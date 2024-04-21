import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function DeleteForms() {
    const [idToDelete, setIdToDelete] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = async (endpoint) => {
        if (idToDelete) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/${endpoint}/${idToDelete}`);
                setMessage(`Successfully deleted from ${endpoint}`);
                setIdToDelete('');
            } catch (error) {
                setMessage(`Error deleting from ${endpoint}: ${error.message}`);
            }
        } else {
            setMessage("Please enter a valid ID.");
        }
    };

    return (
        <div className="delete-form-container">
            <h2 className='title'>Delete Schedule</h2>
            {message && <div className="delete-message">{message}</div>} 
            <input
                type="text"
                placeholder="Enter ID to delete"
                value={idToDelete}
                onChange={e => setIdToDelete(e.target.value)}
                className="delete-input"
            />
            <button onClick={() => handleDelete('schedule')} className="delete-button">Delete Schedule</button>
            <button onClick={() => handleDelete('auditorium')} className="delete-button">Delete Auditorium</button>
            <button onClick={() => handleDelete('group')} className="delete-button">Delete Group</button>
            <button onClick={() => handleDelete('subject')} className="delete-button">Delete Subject</button>
        </div>
    );
}

export default DeleteForms;
