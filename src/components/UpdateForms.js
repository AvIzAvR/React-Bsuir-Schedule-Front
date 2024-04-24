import React, { useState } from 'react';
import axios from 'axios';

function UpdateForms() {
    const [idToUpdate, setIdToUpdate] = useState('');
    const [scheduleData, setScheduleData] = useState({
        courseInfo: {
            classGroup: '',
            roomNumber: '',
            courseTitle: '',
            lecturer: ''
        },
        scheduleInfo: {
            weekday: '',
            subgroupIndex: '',
            weekOrdinal: '',
            sessionStart: '',
            sessionEnd: ''
        }
    });
    
    const [message, setMessage] = useState('');

    const handleInputChange = (part, field, value) => {
        let valid = true;
        if (field === 'subgroupIndex' || field === 'weekOrdinal') {
            valid = /^\d+$/.test(value) && (field === 'subgroupIndex' ? (value === '1' || value === '2') : (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 4));
        }
    
        if (valid) {
            setScheduleData(prev => ({
                ...prev,
                [part]: {
                    ...prev[part],
                    [field]: value
                }
            }));
        }
    };
    

    const isPutValid = () => {
        return Object.values(scheduleData.courseInfo).every(value => value.trim() !== '') &&
               Object.values(scheduleData.scheduleInfo).every(value => value.trim() !== '');
    };
    

    const handleUpdate = async () => {
        if (!idToUpdate || !isPutValid()) {
            setMessage("Please enter an ID and fill all fields.");
            return;
        }
    
        console.log("Sending data to server:", scheduleData);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/schedule/${idToUpdate}`, scheduleData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Server response:", response);
            setScheduleData({
                courseInfo: {
                    classGroup: '',
                    roomNumber: '',
                    courseTitle: '',
                    lecturer: ''
                },
                scheduleInfo: {
                    weekday: '',
                    subgroupIndex: '',
                    weekOrdinal: '',
                    sessionStart: '',
                    sessionEnd: ''
                }
            });
            setIdToUpdate('');
            setMessage(''); 
        } catch (error) {
            setMessage(`Error updating schedule: ${error.message}`);
        }
    };
    

    return (
        <div className="update-form-container">
            <h2 className='title'>Update Schedule</h2>
            <input
                type="text"
                placeholder="Enter ID to update"
                value={idToUpdate}
                onChange={e => setIdToUpdate(e.target.value)}
                className="update-id-input"
            />
            {Object.entries(scheduleData).map(([part, details]) => (
                <div key={part} className="bulk-schedule-item">
                    {Object.entries(details).map(([field, value]) => (
                        <input
                            key={field}
                            type={field === 'sessionStart' || field === 'sessionEnd' ? 'time' : field === 'weekOrdinal' || field === 'subgroupIndex' ? 'number' : 'text'}
                            placeholder={field}
                            value={value}
                            onChange={e => handleInputChange(part, field, e.target.value)}
                            className="update-input"
                        />
                    ))}
                </div>
            ))}
            <button onClick={handleUpdate} disabled={!idToUpdate || !isPutValid()} className="update-button">PUT Update</button>
            {message && <div className="update-message">{message}</div>}
        </div>
    );
}

export default UpdateForms;
