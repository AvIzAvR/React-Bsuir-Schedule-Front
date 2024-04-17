import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [group, setGroup] = useState('250505');
    const [dayOfWeek, setDayOfWeek] = useState('Tuesday');
    const [weekNumber, setWeekNumber] = useState(1);
    const [subgroup, setSubgroup] = useState(1);

    const fetchSchedule = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/schedule?groupNumber=${group}&dayOfWeek=${dayOfWeek}&targetWeekNumber=${weekNumber}&numSubgroup=${subgroup}`);
            setSchedule(response.data);
        } catch (error) {
            console.error("Ошибка при получении расписания:", error);
        }
    };

    return (
        <div className="schedule-container">
            <h1 className="schedule-header">My Schedule</h1>
            <div className="input-group">
                <h2 className="filter-text">Filter by:</h2>
                <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Group Number"/>
                <input type="text" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}
                       placeholder="Day of Week"/>
                <input type="number" value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)}
                       placeholder="Week Number"/>
                <input type="number" value={subgroup} onChange={(e) => setSubgroup(e.target.value)}
                       placeholder="Subgroup"/>
                <button onClick={fetchSchedule}>Get Schedule</button>
            </div>
            {schedule.length > 0 ? (
                <ul>
                {schedule.map((item, index) => (
                    <div key={index} className="schedule-item">
                        <li key={index}>
                            <h4>{item.courseInfo.courseTitle}</h4>
                            <p>Time: {item.scheduleInfo.sessionStart} - {item.scheduleInfo.sessionEnd}</p>
                            <p>Room: {item.courseInfo.roomNumber}</p>
                            <p>Teacher: {item.courseInfo.lecturer}</p>
                        </li>
                    </div>
                ))}
            </ul>
                ) : (
                <p className="error-text">No schedule found for the provided parameters.</p>
            )}
        </div>
    );
}

export default Schedule;
