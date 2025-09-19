import React, { useState, useEffect } from 'react';
import api from '../api';

const RefTableManagement = ({ showNotification, isSuperuser }) => {
  const [refTables, setRefTables] = useState([]);
  const [allTables, setAllTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [isReference, setIsReference] = useState(false);

  useEffect(() => {
    if (isSuperuser) {
      fetchRefTables();
      fetchAllTables();
    }
  }, [isSuperuser]);

  const fetchRefTables = async () => {
    setLoading(true);
    try {
      const response = await api.getRefTables();
      setRefTables(response.data);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTables = async () => {
    try {
      const response = await api.getAllTables();
      setAllTables(response.data);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleAddTable = async () => {
    if (!selectedTable) {
      showNotification('Выберите таблицу', 'error');
      return;
    }

    try {
      await api.addTableToRef(selectedTable, isReference);
      showNotification(`Таблица ${selectedTable} добавлена в справочник`);
      setShowAddModal(false);
      setSelectedTable('');
      setIsReference(false);
      fetchRefTables();
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleRemoveTable = async (tableName) => {
    if (!window.confirm(`Удалить таблицу ${tableName} из справочника?`)) {
      return;
    }

    try {
      await api.removeTableFromRef(tableName);
      showNotification(`Таблица ${tableName} удалена из справочника`);
      fetchRefTables();
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    }
  };

  if (!isSuperuser) {
    return (
      <div className="main-container">
        <div className="panel">
          <div className="panel-header">
            <h2>Reference Tables Management</h2>
          </div>
          <div className="access-denied">
            <h3>Доступ запрещен</h3>
            <p>Только суперпользователь может управлять справочными таблицами</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="panel">
        <div className="panel-header">
          <h2>Reference Tables Management</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="button button-success"
          >
            Add Table to Reference
          </button>
        </div>

        {/* Модальное окно добавления таблицы */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add Table to Reference</h3>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="form-select"
              >
                <option value="">Select table</option>
                {allTables
                  .filter(table => !refTables.some(ref => ref.table_name === table))
                  .map(table => (
                    <option key={table} value={table}>{table}</option>
                  ))}
              </select>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isReference}
                  onChange={(e) => setIsReference(e.target.checked)}
                />
                Is Reference Table
              </label>
              
              <div className="modal-buttons">
                <button onClick={handleAddTable} className="button button-primary">
                  Add
                </button>
                <button onClick={() => setShowAddModal(false)} className="button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading reference tables...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Table Name</th>
                  <th>Is Reference</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {refTables.map((table) => (
                  <tr key={table.id}>
                    <td>{table.table_name}</td>
                    <td>
                      <span className={`badge ${table.is_reference ? 'badge-success' : 'badge-warning'}`}>
                        {table.is_reference ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleRemoveTable(table.table_name)}
                        className="button button-danger button-small"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {refTables.length === 0 && (
              <div className="no-data">
                No tables in reference list
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RefTableManagement;