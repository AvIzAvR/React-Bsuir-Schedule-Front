import React, { useState, useEffect } from 'react';
import api from '../api';

const QueryView = ({ showNotification, isSuperuser }) => {
  const [queryResults, setQueryResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [savedQueries, setSavedQueries] = useState([]);
  const [columns, setColumns] = useState([]);
  const [activeQueryTab, setActiveQueryTab] = useState('predefined');
  const [resultType, setResultType] = useState(null); 

  
  useEffect(() => {
    const fetchSavedQueries = async () => {
      try {
        const response = await api.executeCustomQuery('SELECT * FROM saved_queries');
        setSavedQueries(response.data);
      } catch (err) {
        showNotification(err.response?.data?.message || err.message, 'error');
      }
    };
    fetchSavedQueries();
  }, [showNotification]);

  
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

  
  const executePredefinedQuery = async (endpoint, name) => {
    setLoading(true);
    try {
      const response = await api.executePredefinedQuery(endpoint);
      processQueryResults(response.data, name);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  
  const executeCustomQueryHandler = async () => {
    if (!customQuery.trim()) {
      showNotification('Please enter a query', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.executeCustomQuery(customQuery);
      processQueryResults(response.data, 'Custom Query');
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const processQueryResults = (data, queryName) => {
    
    if (typeof data === 'string' || typeof data === 'number' || data === null) {
        setQueryResults(String(data));
        setResultType('scalar');
        showNotification(`Query "${queryName}" executed successfully`);
        return;
    }

    
    if (typeof data === 'object' && !Array.isArray(data)) {
        const processedData = [data].map(row => {
            const processedRow = {};
            for (const [key, value] of Object.entries(row)) {
                processedRow[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            }
            return processedRow;
        });
        
        setQueryResults(processedData);
        setColumns(processedData.length > 0 ? Object.keys(processedData[0]) : []);
        setResultType('table');
        showNotification(`Query "${queryName}" executed successfully`);
        return;
    }

    
    if (Array.isArray(data)) {
        const processedData = data.map(row => {
            const processedRow = {};
            for (const [key, value] of Object.entries(row)) {
                processedRow[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            }
            return processedRow;
        });
        
        setQueryResults(processedData);
        setColumns(processedData.length > 0 ? Object.keys(processedData[0]) : []);
        setResultType('table');
        showNotification(`Query "${queryName}" executed successfully`);
        return;
    }

    
    setQueryResults(null);
    setResultType(null);
    showNotification('Unexpected response format from server', 'error');
};

  
  const saveQuery = async () => {
    if (!customQuery.trim()) {
      showNotification('Please enter a query to save', 'error');
      return;
    }

    try {
      const queryName = prompt('Enter a name for this query:') || `Custom Query ${savedQueries.length + 1}`;
      
      
      await api.executeCustomQuery(
        `INSERT INTO saved_queries (name, query) VALUES ('${queryName}', '${customQuery}')`
      );
      
      
      const response = await api.executeCustomQuery('SELECT * FROM saved_queries');
      setSavedQueries(response.data);
      
      showNotification('Query saved successfully');
      setCustomQuery('');
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    }
  };

  
  const deleteSavedQuery = async (id) => {
    try {
      await api.executeCustomQuery(`DELETE FROM saved_queries WHERE id = ${id}`);
      const response = await api.executeCustomQuery('SELECT * FROM saved_queries');
      setSavedQueries(response.data);
      showNotification('Query deleted successfully');
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    }
  };

  
  const predefinedQueries = [
    { name: "Clients with last name starting with 'Ива'", endpoint: "clients_with_last_name_Iva" },
    { name: "Audi cars after 2015", endpoint: "cars_audi_after_2015" },
    { name: "STOs with working hours", endpoint: "stos_working_hours_and_address" },
    { name: "High salary employees on 'L' streets", endpoint: "employees_high_salary_street_L" },
    { name: "Completed orders with addresses", endpoint: "completed_orders_with_street_address" },
    { name: "Parts in expensive orders", endpoint: "spare_parts_in_expensive_orders" },
    { name: "Low salary employees in expensive orders", endpoint: "employees_low_salary_high_order_amount" },
    { name: "Orders with Bosch parts", endpoint: "orders_with_bosch_parts" },
    { name: "STOs with high salary employees", endpoint: "stos_high_salary_employees_high_order_amount" },
    { name: "Employees in STOs with expensive orders", endpoint: "employees_in_stos_with_high_order_amount" },
    { name: "STOs with high salary employees and expensive orders", endpoint: "stos_with_high_salary_employees_and_high_order_amount" },
    { name: "STOs with employees earning >10,000 and expensive orders", endpoint: "stos_with_employees_high_salary_and_high_order_amount" },
    { name: "Total sum of completed orders", endpoint: "total_completed_orders_sum" },
    { name: "Average service cost by category", endpoint: "average_service_cost_by_category" },
    { name: "Clients born after 1990", endpoint: "young_clients_count" },
    { name: "Most expensive order", endpoint: "most_expensive_order" },
    { name: "Car count by brand", endpoint: "car_count_by_brand" },
    { name: "Orders with services >5000 rub", endpoint: "orders_with_expensive_services" },
    { name: "Employees with above average salary", endpoint: "employees_with_above_average_salary" },
    { name: "Parts with stock <20", endpoint: "spare_parts_with_low_stock" },
    { name: "Top 3 STOs by employee count", endpoint: "top3_stos_by_employee_count" },
    { name: "Incomplete orders", endpoint: "incomplete_orders" },
    { name: "Top 5 most requested services", endpoint: "top5_services" },
    { name: "Clients with their cars", endpoint: "clients_with_cars" },
    { name: "Total inventory value", endpoint: "total_inventory_value" }
  ];

  return (
    <div className="main-container">
      <div className="panel">
        <div className="panel-header">
          <h2>Query Manager</h2>
          <div className="query-tabs">
            <button
              className={`tab-button ${activeQueryTab === 'predefined' ? 'active' : ''}`}
              onClick={() => setActiveQueryTab('predefined')}
            >
              Predefined Queries
            </button>
            <button
              className={`tab-button ${activeQueryTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveQueryTab('custom')}
            >
              Custom SQL
            </button>
          </div>
        </div>
        
        {activeQueryTab === 'predefined' ? (
          <div className="queries-container">
            <div className="query-grid">
              {predefinedQueries.map((query, index) => (
                <div key={index} className="query-card">
                  <h3>{query.name}</h3>
                  <button 
                    onClick={() => executePredefinedQuery(query.endpoint, query.name)}
                    className="button button-primary"
                    disabled={loading}
                  >
                    Execute
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="form-group">
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Enter your SQL query here"
                rows={4}
              />
              <div className="form-row">
                <button
                  onClick={executeCustomQueryHandler}
                  className="button button-primary"
                  disabled={loading || !customQuery.trim()}
                >
                  Execute
                </button>
                <button
                  onClick={saveQuery}
                  className="button button-success"
                  disabled={loading || !customQuery.trim()}
                >
                  Save
                </button>
              </div>
            </div>

            <div className="queries-container">
              <h3>Saved Queries</h3>
              <div className="query-grid">
                {savedQueries.map((query) => (
                  <div key={query.id} className="query-card">
                    <h3>{query.name}</h3>
                    <p className="query-text">{query.query}</p>
                    <div className="query-actions">
                      <button
                        onClick={() => {
                          setCustomQuery(query.query);
                          executeCustomQueryHandler();
                        }}
                        className="button button-primary"
                        disabled={loading}
                      >
                        Execute
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this saved query?')) {
                            deleteSavedQuery(query.id);
                          }
                        }}
                        className="button button-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="panel results-panel">
        <div className="panel-header">
          <h2>Query Results</h2>
        </div>
        
        {loading ? (
          <div className="loading">Loading data...</div>
        ) : (
          <div className="results-container">
            {resultType === 'table' && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {columns.map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults && queryResults.length > 0 ? (
                      queryResults.map((row, index) => (
                        <tr key={index}>
                          {columns.map((key) => (
                            <td key={`${index}-${key}`}>
                              {key === 'duration' || key === 'warranty_period' 
                                ? formatInterval(row[key])
                                : String(row[key])}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length || 1} className="no-data">
                          No data returned
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {resultType === 'scalar' && (
              <div className="scalar-result">
                <div className="scalar-result-header">
                  <h3>Result</h3>
                </div>
                <div className="scalar-result-value">
                  {queryResults}
                </div>
              </div>
            )}
            
            {resultType === null && (
              <div className="no-results">
                Execute a query to see results
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryView;