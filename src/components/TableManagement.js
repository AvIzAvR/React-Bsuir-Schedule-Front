import React, { useState, useEffect } from 'react';
import api from '../api';

const TableManagement = ({ showNotification }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [tables, setTables] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    tableName: '',
    columns: '',
    columnName: '',
    columnType: 'VARCHAR(255)',
    condition: '',
    newValue: '',
    rowData: '{}'
  });
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [columns, setColumns] = useState([]);

  const formatInterval = (value) => {
    if (typeof value === 'object' && value !== null) {
      if (value.hours !== undefined || value.minutes !== undefined || value.seconds !== undefined) {
        const hours = value.hours || 0;
        const minutes = value.minutes || 0;
        const seconds = value.seconds || 0;
        return `${hours}h ${minutes}m ${seconds}s`;
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setIsLoading(true);
        const response = await api.getAllTables();
        if (response.data && Array.isArray(response.data)) {
          setTables(response.data);
        } else {
          throw new Error('Invalid tables data format');
        }
      } catch (err) {
        console.error('Failed to load tables:', err);
        setError('Failed to load tables list');
        showNotification('Failed to load tables list', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTables();
  }, []);

  const loadTableData = async (tableName) => {
    if (!tableName) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getTableData(tableName);
      if (!response.data) {
        throw new Error('No data received');
      }
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setTableData(data);
      setSelectedTable(tableName);
      const cols = data.length > 0 ? Object.keys(data[0]) : (response.columns || []);
      setColumns(cols);
      showNotification(`Table ${tableName} loaded successfully`);
    } catch (err) {
      console.error('Failed to load table data:', err);
      const errorMsg = err.response?.data?.message || err.message;
      setError(`Failed to load table: ${errorMsg}`);
      showNotification(`Failed to load table: ${errorMsg}`, 'error');
      setTableData([]);
      setColumns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateTable = async () => {
    if (!formData.tableName || !formData.columns) {
      showNotification('Table name and columns are required', 'error');
      return;
    }
    try {
      setIsLoading(true);
      await api.createTable(formData.tableName, formData.columns);
      showNotification(`Table ${formData.tableName} created successfully`);
      setTables([...tables, formData.tableName]);
      loadTableData(formData.tableName);
    } catch (err) {
      console.error('Failed to create table:', err);
      showNotification(`Failed to create table: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTable = async () => {
    if (!selectedTable || !formData.columnName || !formData.newValue || !formData.condition) {
      showNotification('All fields are required for update', 'error');
      return;
    }
    try {
      setIsLoading(true);
      await api.updateTable(
        selectedTable,
        formData.columnName,
        formData.newValue,
        formData.condition
      );
      showNotification('Table updated successfully');
      loadTableData(selectedTable);
    } catch (err) {
      console.error('Failed to update table:', err);
      showNotification(`Failed to update table: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertRow = async () => {
    if (!selectedTable || !formData.rowData) {
      showNotification('Table must be selected and row data provided', 'error');
      return;
    }
    try {
      setIsLoading(true);
      const data = JSON.parse(formData.rowData);
      await api.insertRow(selectedTable, data);
      showNotification('Row inserted successfully');
      loadTableData(selectedTable);
    } catch (err) {
      console.error('Failed to insert row:', err);
      showNotification(`Failed to insert row: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropTable = async () => {
    if (!selectedTable) {
      showNotification('No table selected', 'error');
      return;
    }
    try {
      setIsLoading(true);
      await api.dropTable(selectedTable);
      showNotification(`Table ${selectedTable} dropped successfully`);
      setTables(tables.filter(table => table !== selectedTable));
      setSelectedTable('');
      setTableData([]);
      setColumns([]);
    } catch (err) {
      console.error('Failed to drop table:', err);
      showNotification(`Failed to drop table: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddColumn = async () => {
    if (!selectedTable || !formData.columnName || !formData.columnType) {
      showNotification('Column name and type are required', 'error');
      return;
    }
    try {
      setIsLoading(true);
      await api.addColumn(selectedTable, formData.columnName, formData.columnType);
      showNotification('Column added successfully');
      loadTableData(selectedTable);
    } catch (err) {
      console.error('Failed to add column:', err);
      showNotification(`Failed to add column: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropColumn = async () => {
    if (!selectedTable || !formData.columnName) {
      showNotification('Table and column name are required', 'error');
      return;
    }
    try {
      setIsLoading(true);
      await api.dropColumn(selectedTable, formData.columnName);
      showNotification('Column dropped successfully');
      loadTableData(selectedTable);
    } catch (err) {
      console.error('Failed to drop column:', err);
      showNotification(`Failed to drop column: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (row) => {
    setEditingRow(row);
    const editableFields = { ...row };
    delete editableFields.id;
    setEditFormData(editableFields);
  };

  const saveEditedRow = async () => {
    try {
      const condition = `id = ${editingRow.id}`;
      for (const [column, value] of Object.entries(editFormData)) {
        if (editingRow[column] !== value) {
          await api.updateTable(
            selectedTable,
            column,
            typeof value === 'string' ? `'${value}'` : value,
            condition
          );
        }
      }
      showNotification('Row updated successfully');
      setEditingRow(null);
      loadTableData(selectedTable);
    } catch (err) {
      console.error('Failed to update row:', err);
      showNotification(`Failed to update row: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  const cancelEditing = () => {
    setEditingRow(null);
  };

  return (
    <div className="main-container">
      <div className="panel">
        <div className="panel-header">
          <h2>Table Operations</h2>
          <div className="form-row tabs">
            <button
              onClick={() => setActiveTab('browse')}
              className={`button ${activeTab === 'browse' ? 'button-primary' : ''}`}
            >
              Browse
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`button ${activeTab === 'create' ? 'button-primary' : ''}`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('modify')}
              className={`button ${activeTab === 'modify' ? 'button-primary' : ''}`}
            >
              Modify
            </button>
          </div>
        </div>
        <div className="panel-content">
          {isLoading && <div className="loading">Loading...</div>}
          {error && <div className="error-message">{error}</div>}
          {activeTab === 'browse' && (
            <div className="form-group">
              <label>Select Table:</label>
              <select
                value={selectedTable}
                onChange={(e) => loadTableData(e.target.value)}
                className="form-select"
                disabled={isLoading}
              >
                <option value="">Select table</option>
                {tables.map(table => (
                  <option key={table} value={table}>{table}</option>
                ))}
              </select>
            </div>
          )}
          {activeTab === 'create' && (
            <div className="form-group">
              <label>Table Name:</label>
              <input
                type="text"
                name="tableName"
                value={formData.tableName}
                onChange={handleChange}
                disabled={isLoading}
              />
              <label>Columns (format: "col1 TYPE, col2 TYPE"):</label>
              <textarea
                name="columns"
                value={formData.columns}
                onChange={handleChange}
                placeholder="id INT PRIMARY KEY, name VARCHAR(100)"
                disabled={isLoading}
              />
              <button
                onClick={handleCreateTable}
                className="button button-success"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Table'}
              </button>
            </div>
          )}
          {activeTab === 'modify' && selectedTable && (
            <>
              <div className="form-group">
                <h3>Modify Table: {selectedTable}</h3>
                <div className="form-row">
                  <div className="form-control">
                    <label>Column Name:</label>
                    <input
                      type="text"
                      name="columnName"
                      value={formData.columnName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-control">
                    <label>Column Type:</label>
                    <select
                      name="columnType"
                      value={formData.columnType}
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      <option value="VARCHAR(255)">VARCHAR(255)</option>
                      <option value="INT">INT</option>
                      <option value="FLOAT">FLOAT</option>
                      <option value="DATE">DATE</option>
                      <option value="BOOLEAN">BOOLEAN</option>
                      <option value="INTERVAL">INTERVAL</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <button
                    onClick={handleAddColumn}
                    className="button button-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add Column'}
                  </button>
                  <button
                    onClick={handleDropColumn}
                    className="button button-danger"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Dropping...' : 'Drop Column'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <h3>Table Data Operations</h3>
                <div className="form-row">
                  <div className="form-control">
                    <label>Column to Update:</label>
                    <input
                      type="text"
                      name="columnName"
                      value={formData.columnName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-control">
                    <label>New Value:</label>
                    <input
                      type="text"
                      name="newValue"
                      value={formData.newValue}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label>WHERE Condition:</label>
                  <input
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    placeholder="id = 1"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleUpdateTable}
                  className="button button-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Data'}
                </button>
                <div className="form-group">
                  <label>Insert Row (JSON):</label>
                  <textarea
                    name="rowData"
                    value={formData.rowData}
                    onChange={handleChange}
                    placeholder='{"column1": "value1", "column2": "value2"}'
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleInsertRow}
                    className="button button-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Inserting...' : 'Insert Row'}
                  </button>
                </div>
                <div className="form-group">
                  <button
                    onClick={handleDropTable}
                    className="button button-danger"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Dropping...' : 'Drop Table'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="panel results-panel">
        <div className="panel-header">
          <h2>Table Data: {selectedTable || 'none'}</h2>
        </div>
        <div className="panel-content">
          {isLoading ? (
            <div className="loading">Loading table data...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {columns.map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                    {columns.length > 0 && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((row, index) => (
                      <tr key={index}>
                        {columns.map((key) => (
                          <td key={key}>
                            {editingRow && editingRow.id === row.id && key !== 'id' ? (
                              <input
                                type="text"
                                name={key}
                                value={editFormData[key] || ''}
                                onChange={handleEditChange}
                              />
                            ) : (
                              key === 'duration' || key === 'warranty_period'
                                ? formatInterval(row[key])
                                : String(row[key])
                            )}
                          </td>
                        ))}
                        <td>
                          {editingRow && editingRow.id === row.id ? (
                            <>
                              <button
                                onClick={saveEditedRow}
                                className="button button-success small"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="button button-danger small"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEditing(row)}
                              className="button button-primary small"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 1} className="no-data">
                        {selectedTable ? 'No data available' : 'Select a table to view data'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableManagement;