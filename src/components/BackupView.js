import React, { useState, useEffect } from 'react';
import api from '../api';

const BackupView = ({ showNotification, isSuperuser }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [formData, setFormData] = useState({
    tableName: '',
    filename: ''
  });
  const [file, setFile] = useState(null);
  const [tables, setTables] = useState([]);
  const [operationLog, setOperationLog] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await api.getAllTables();
        setTables(response.data);
        addToLog('Tables list loaded successfully');
      } catch (err) {
        showNotification(err.response?.data?.message || err.message, 'error');
        addToLog(`Error loading tables: ${err.message}`);
      }
    };
    fetchTables();
  }, []);

  const addToLog = (message) => {
    setOperationLog(prev => [
      { timestamp: new Date().toLocaleTimeString(), message },
      ...prev.slice(0, 50) 
    ]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.replace(/\./g, '')
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    addToLog(`Selected file: ${e.target.files[0]?.name}`);
  };

  const handleExport = async () => {
    addToLog(`Starting export of table ${formData.tableName} to Excel`);
    try {
      await api.exportToExcel(formData.tableName, formData.filename);
      showNotification(`Exported to ${formData.filename}.xlsx successfully`);
      addToLog(`Successfully exported to ${formData.filename}.xlsx`);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
      addToLog(`Export failed: ${err.message}`);
    }
  };

  const handleBackup = async () => {
    addToLog(`Starting backup of table ${formData.tableName}`);
    try {
      await api.backupTable(formData.tableName, formData.filename);
      showNotification(`Backup ${formData.filename}.sql created successfully`);
      addToLog(`Table backup created: ${formData.filename}.sql`);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
      addToLog(`Backup failed: ${err.message}`);
    }
  };

  const handleFullBackup = async () => {
    addToLog('Starting full database backup');
    try {
      await api.fullBackup(formData.filename);
      showNotification(`Full backup ${formData.filename}.sql created successfully`);
      addToLog(`Full backup created: ${formData.filename}.sql`);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
      addToLog(`Full backup failed: ${err.message}`);
    }
  };

  const handleImport = async () => {
    if (!file) {
      showNotification('Please select a file first', 'error');
      addToLog('Import attempted without file selection');
      return;
    }

    addToLog(`Starting import from file: ${file.name}`);
    try {
      await api.loadBackup(file);
      showNotification('Backup imported successfully');
      addToLog('Backup imported successfully');
      
      const response = await api.getAllTables();
      setTables(response.data);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
      addToLog(`Import failed: ${err.message}`);
    }
  };

  return (
    <div className="main-container">
      <div className="panel backup-operations-panel">
        <div className="panel-header">
          <h2>Backup Operations</h2>
          <div className="form-row">
            <button 
              onClick={() => setActiveTab('export')}
              className={`button ${activeTab === 'export' ? 'button-primary' : ''}`}
            >
              Export
            </button>
            <button 
              onClick={() => setActiveTab('backup')}
              className={`button ${activeTab === 'backup' ? 'button-primary' : ''}`}
            >
              Backup
            </button>
            <button 
              onClick={() => setActiveTab('import')}
              className={`button ${activeTab === 'import' ? 'button-primary' : ''}`}
            >
              Import
            </button>
          </div>
        </div>

        <div className="backup-content">
          {activeTab === 'export' && (
            <div className="form-group">
              <label>Table Name:</label>
              <select
                name="tableName"
                value={formData.tableName}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select table</option>
                {tables.map(table => (
                  <option key={table} value={table}>{table}</option>
                ))}
              </select>
              
              <label>Filename (without extension):</label>
              <input 
                type="text" 
                name="filename"
                value={formData.filename}
                onChange={handleChange}
              />
              <p className="filename-hint">Will be saved as: {formData.filename || '...'}.xlsx</p>
              
              <button 
                onClick={handleExport}
                className="button button-success"
                disabled={!formData.tableName || !formData.filename}
              >
                Export to Excel
              </button>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="backup-tabs-container">
              <div className="form-group">
                <h3>Table Backup</h3>
                <label>Table Name:</label>
                <select
                  name="tableName"
                  value={formData.tableName}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select table</option>
                  {tables.map(table => (
                    <option key={table} value={table}>{table}</option>
                  ))}
                </select>
                
                <label>Filename (without extension):</label>
                <input 
                  type="text" 
                  name="filename"
                  value={formData.filename}
                  onChange={handleChange}
                />
                <p className="filename-hint">Will be saved as: {formData.filename || '...'}.sql</p>
                
                <button 
                  onClick={handleBackup}
                  className="button button-primary"
                  disabled={!formData.tableName || !formData.filename || !isSuperuser}
                  title={!isSuperuser ? "Superuser required" : ""}
                >
                  Backup Table
                </button>
              </div>

              <div className="form-group">
                <h3>Full Database Backup</h3>
                <label>Filename (without extension):</label>
                <input 
                  type="text" 
                  name="filename"
                  value={formData.filename}
                  onChange={handleChange}
                />
                <p className="filename-hint">Will be saved as: {formData.filename || '...'}.sql</p>
                
                <button 
                  onClick={handleFullBackup}
                  className="button button-primary"
                  disabled={!formData.filename || !isSuperuser}
                  title={!isSuperuser ? "Superuser required" : ""}
                >
                  Full Backup
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="form-group">
              <input 
                type="file" 
                id="backupFile"
                className="file-input"
                onChange={handleFileChange}
                accept=".sql"
              />
              <label htmlFor="backupFile" className="button">
                Select SQL File
              </label>
              {file && <p>Selected: {file.name}</p>}
              
              <button 
                onClick={handleImport}
                className="button button-primary"
                disabled={!file || !isSuperuser}
                title={!isSuperuser ? "Superuser required" : ""}
              >
                Import Backup
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="panel results-panel">
        <div className="panel-header">
          <h2>Operation Log</h2>
          <button 
            className="button button-small"
            onClick={() => setOperationLog([])}
          >
            Clear Log
          </button>
        </div>
        <div className="log-container">
          {operationLog.length > 0 ? (
            <div className="log-content">
              {operationLog.map((entry, index) => (
                <div key={index} className="log-entry">
                  <span className="log-time">[{entry.timestamp}]</span>
                  <span className="log-message">{entry.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No operations performed yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupView;