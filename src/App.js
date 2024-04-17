import React, { useState } from 'react';
import './App.css';
import Schedule from './components/Schedule';

function App() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="App">
            <div className="content-container">
                <aside className="sidebar">
                    <h1 className="header-title">Bsuir Schedule</h1>
                    <button onClick={toggleVisibility}>Dashboard</button>
                    <button className="settings-button">Settings</button>
                </aside>
                {isVisible && <Schedule/>}
            </div>
        </div>
    );
}

export default App;
