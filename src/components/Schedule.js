import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [group, setGroup] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [weekNumber, setWeekNumber] = useState('');
    const [subgroup, setSubgroup] = useState('');

    const handleInputChange = (field, value) => {
        if (field === "weekNumber") {
            const number = parseInt(value, 10);
            if (number >= 1 && number <= 4) {
                setWeekNumber(value);
            }
        } else if (field === "subgroup") {
            const number = parseInt(value, 10);
            if (number >= 0 && number <= 2) {
                setSubgroup(value);
            }
        } else if (field === "group") {
            setGroup(value);
        } else if (field === "dayOfWeek") {
            setDayOfWeek(value);
        }
    };

    useEffect(() => {
        const allFieldsFilled = group && dayOfWeek && weekNumber && subgroup;

        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`https://javalabs-ystr.onrender.com/schedule?groupNumber=${group}&dayOfWeek=${dayOfWeek}&targetWeekNumber=${weekNumber}&numSubgroup=${subgroup}`);
                setSchedule(response.data);
            } catch (error) {
                console.error("Ошибка при получении расписания:", error);
            }
        };

        if (allFieldsFilled) {
            fetchSchedule();
        }
    }, [group, dayOfWeek, weekNumber, subgroup]);

    return (
        <div className="schedule-container">
            <div className="control-panel">
                <h1 className="title">Dashboard</h1>
                <div className="input-group">
                    <input type="text" value={group} onChange={(e) => handleInputChange('group', e.target.value)} placeholder="Group Number"/>
                    <input type="text" value={dayOfWeek} onChange={(e) => handleInputChange('dayOfWeek', e.target.value)} placeholder="Day of Week"/>
                    <input type="number" value={weekNumber} onChange={(e) => handleInputChange('weekNumber', e.target.value)} placeholder="Week Number"/>
                    <input type="number" value={subgroup} onChange={(e) => handleInputChange('subgroup', e.target.value)} placeholder="Subgroup"/>
                </div>
            </div>
            {schedule.length > 0 ? (
                <ul>
                    {schedule.map((item, index) => (
                        <li key={index} className="schedule-item">
                            <h4>{item.courseInfo.courseTitle}</h4>
                            <p>Time: {item.scheduleInfo.sessionStart} - {item.scheduleInfo.sessionEnd}</p>
                            <p>Room: {item.courseInfo.roomNumber}</p>
                            <p>Teacher: {item.courseInfo.lecturer}</p>
                            <p>Subgroup: {item.scheduleInfo.subgroupIndex}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="error-text">No schedule found for the provided parameters.</p>
            )}
        </div>
    );
}

export default Schedule;
