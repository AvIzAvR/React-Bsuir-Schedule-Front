import React, { useState } from 'react';
import './App.css';
import Schedule from './components/Schedule';
import BulkScheduleForm from './components/BulkScheduleForm';
import DeleteForms from './components/DeleteForms';
import UpdateForms from './components/UpdateForms';
import RequestCounter from './components/RequestCounter'; 

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const toggleDashboard = () => {
    setActiveView('dashboard');
  };

  const showAddScheduleForm = () => {
    setActiveView('addSchedule');
  };

  const showDeleteForms = () => {
    setActiveView('deleteSchedule');
  };

  const showUpdateForms = () => {
    setActiveView('updateSchedule');
  };

  return (
    <div className="App">
      <div className="content-container">
        <aside className="sidebar">
          <h1 className="header-title">Bsuir Schedule</h1>
          <button className={activeView === 'dashboard' ? "active-button" : ""} onClick={toggleDashboard}>
            Dashboard
          </button>
          <button className={activeView === 'addSchedule' ? "active-button" : ""} onClick={showAddScheduleForm}>
            Add Schedule
          </button>
          <button className={activeView === 'deleteSchedule' ? "active-button" : ""} onClick={showDeleteForms}>
            Delete Schedule
          </button>
          <button className={activeView === 'updateSchedule' ? "active-button" : ""} onClick={showUpdateForms}>
            Update Schedule
          </button>
          <RequestCounter />
        </aside>
        {activeView === 'dashboard' && <Schedule />}
        {activeView === 'addSchedule' && <BulkScheduleForm />}
        {activeView === 'deleteSchedule' && <DeleteForms />}
        {activeView === 'updateSchedule' && <UpdateForms />}
      </div>
    </div>
  );
}

export default App;
