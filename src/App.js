import React, { Suspense, lazy, useState } from 'react';
import './App.css';

const QueryView = lazy(() => import('./components/QueryView'));
const TableManagement = lazy(() => import('./components/TableManagement'));
const BackupView = lazy(() => import('./components/BackupView'));

function App() {
  const [activeView, setActiveView] = useState('queries');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const views = {
    queries: {
      name: 'Queries',
      component: <QueryView showNotification={showNotification} />
    },
    tables: {
      name: 'Tables',
      component: <TableManagement showNotification={showNotification} />
    },
    backup: {
      name: 'Backup',
      component: <BackupView showNotification={showNotification} />
    }
  };

  return (
    <div className="App">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="header">
        <h1>Auto Service Database Manager</h1>
        <div className="nav-buttons">
          {Object.entries(views).map(([key, view]) => (
            <button 
              key={key}
              onClick={() => setActiveView(key)}
              className={`button ${activeView === key ? 'active' : ''}`}
            >
              {view.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="main-container">
        <Suspense fallback={<div className="loading">Loading module...</div>}>
          {views[activeView].component}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
