import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Schedule() {
    const [schedule, setSchedule] = useState([]);
    const [group, setGroup] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [weekNumber, setWeekNumber] = useState('');
    const [subgroup, setSubgroup] = useState('');

    useEffect(() => {
        const allFieldsFilled = group && dayOfWeek && weekNumber && subgroup;

        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/schedule?groupNumber=${group}&dayOfWeek=${dayOfWeek}&targetWeekNumber=${weekNumber}&numSubgroup=${subgroup}`);
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
                    <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Group Number"/>
                    <input type="text" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} placeholder="Day of Week"/>
                    <input type="number" value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)} placeholder="Week Number"/>
                    <input type="number" value={subgroup} onChange={(e) => setSubgroup(e.target.value)} placeholder="Subgroup"/>
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
