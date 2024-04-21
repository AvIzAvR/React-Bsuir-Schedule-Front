// App.js
import React, { useState, Suspense, lazy } from 'react';
import './App.css';

const Schedule = lazy(() => import('./components/Schedule'));
const BulkScheduleForm = lazy(() => import('./components/BulkScheduleForm'));
const DeleteForms = lazy(() => import('./components/DeleteForms'));
const UpdateForms = lazy(() => import('./components/UpdateForms'));
const RequestCounter = lazy(() => import('./components/RequestCounter'));

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const toggleDashboard = () => setActiveView('dashboard');
  const showAddScheduleForm = () => setActiveView('addSchedule');
  const showDeleteForms = () => setActiveView('deleteSchedule');
  const showUpdateForms = () => setActiveView('updateSchedule');

  return (
    <div className="App">
      <div className="content-container">
        <aside className="sidebar">
          <h1 className="header-title">Bsuir Schedule</h1>
          <button onClick={toggleDashboard} className={activeView === 'dashboard' ? "active-button" : ""}>
            Dashboard
          </button>
          <button onClick={showAddScheduleForm} className={activeView === 'addSchedule' ? "active-button" : ""}>
            Add Schedule
          </button>
          <button onClick={showDeleteForms} className={activeView === 'deleteSchedule' ? "active-button" : ""}>
            Delete Schedule
          </button>
          <button onClick={showUpdateForms} className={activeView === 'updateSchedule' ? "active-button" : ""}>
            Update Schedule
          </button>
          <Suspense fallback={<div>Loading...</div>}>
            <RequestCounter />
          </Suspense>
        </aside>
        <Suspense fallback={<div>Loading...</div>}>
          {activeView === 'dashboard' && <Schedule />}
          {activeView === 'addSchedule' && <BulkScheduleForm />}
          {activeView === 'deleteSchedule' && <DeleteForms />}
          {activeView === 'updateSchedule' && <UpdateForms />}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
