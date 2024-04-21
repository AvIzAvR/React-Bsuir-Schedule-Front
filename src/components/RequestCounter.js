// RequestCounter.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RequestCounter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/schedule/count`);
                console.log("Полученные данные счетчика:", response.data);
                setCount(response.data);
            } catch (error) {
                console.error("Ошибка при получении количества запросов:", error);
                setCount('Ошибка загрузки');
            }
        };

        fetchCount();
    }, []);

    return (
        <div>
            <h5 className='request-counter'>Number of Requests: {count}</h5>
        </div>
    );
}

export default RequestCounter;
