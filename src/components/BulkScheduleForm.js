import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function BulkScheduleForm() {
    const [schedules, setSchedules] = useState([{
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
    }]);

    const handleInputChange = (index, part, field, value) => {
        let valid = true;
        if (field === 'subgroupIndex') {
            valid = value === '1' || value === '2';
        }
        // Проверка для поля weekOrdinal
        else if (field === 'weekOrdinal') {
            valid = value >= 1 && value <= 4 && value.match(/^\d+$/);  
        }
        if (valid) {
            const newSchedules = [...schedules];
            newSchedules[index][part][field] = value;
            setSchedules(newSchedules);
        }
    };

    const handleAddSchedule = () => {
        setSchedules([...schedules, {
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
        }]);
    };

    const handleRemoveSchedule = (index) => {
        setSchedules(schedules.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/schedule/bulk`, schedules);
            console.log("Response:", response.data);
            setSchedules([{
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
            }]);
        } catch (error) {
            console.error("Error submitting schedules:", error);
        }
    };

    const isFormValid = () => {
        return schedules.every(schedule => 
            Object.values(schedule.courseInfo).every(value => value) &&
            Object.values(schedule.scheduleInfo).every(value => value)
        );
    };

    return (
        <div className="bulk-schedule-container">
            <h2 className='title'>Add Schedule</h2>
            {schedules.map((schedule, index) => (
                <div key={index} className="bulk-schedule-item">
                    {index > 0 && (
                        <button onClick={() => handleRemoveSchedule(index)} className="bulk-remove-button">X</button>
                    )}
                    {Object.entries(schedule).map(([part, details]) => (
                        <div key={part}>
                            {Object.entries(details).map(([field, value]) => (
                                <input
                                    key={field}
                                    type={field === 'sessionStart' || field === 'sessionEnd' ? 'time' : field === 'weekOrdinal' || field === 'subgroupIndex' ? 'number' : 'text'}
                                    name={field}
                                    placeholder={field}
                                    value={value}
                                    onChange={(e) => handleInputChange(index, part, field, e.target.value)}
                                    className="bulk-input"
                                    min={field === 'weekOrdinal' ? 1 : undefined}
                                    max={field === 'weekOrdinal' ? 4 : undefined}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleAddSchedule} className="bulk-button">Add New Schedule</button>
            <button onClick={handleSubmit} disabled={!isFormValid()} className="bulk-button">Submit All Schedules</button>
        </div>
    );
}

export default BulkScheduleForm;
