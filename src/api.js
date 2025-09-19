import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});


const sanitizeFilename = (filename) => {
  return filename.replace(/\./g, '') + '.sql';
};

const sanitizeFilenameExcel = (filename) => {
  return filename.replace(/\./g, '') + '.xlsx';
};

const apiService = {
  
  
  
  executePredefinedQuery(endpoint) {
    return api.get(`/queries/${endpoint}`);
  },
  
  
  executeCustomQuery(query) {
    return api.post('/queries/executeCustom', null, { params: { query } });
  },
  
  saveCustomQuery(queryName, query) {
    return api.post('/queries/saveCustom', null, { params: { queryName, query } });
  },
  
  getSavedQuery(queryName) {
    return api.get('/queries/getCustom', { params: { queryName } });
  },
  
  
  
  
  getTableData(tableName) {
    return this.executeCustomQuery(`SELECT * FROM ${tableName} ORDER BY id`);
  },
  
  getAllTables() {
    return api.get('/tables/getAllTables');
  },
  
  
  getTablesList() {
    return this.executeCustomQuery('SHOW TABLES');
  },
  
  
  createTable(tableName, columns) {
    return api.post('/tables/create', null, { params: { tableName, columns } });
  },
  
  updateTable(tableName, columnName, newValue, condition) {
    return api.put('/tables/update', null, { 
      params: { tableName, columnName, newValue, condition } 
    });
  },
  
  insertRow(tableName, data) {
    return api.post('/tables/insert', data, { 
      params: { tableName } 
    });
  },
  
  dropTable(tableName) {
    return api.delete('/tables/drop', { params: { tableName } });
  },
  
  addColumn(tableName, columnName, columnType) {
    return api.post('/tables/addColumn', null, { 
      params: { tableName, columnName, columnType } 
    });
  },
  
  dropColumn(tableName, columnName) {
    return api.delete('/tables/dropColumn', { 
      params: { tableName, columnName } 
    });
  },
  
  
  
  exportToExcel(tableName, filename) {
    return api.get('/tables/export', { 
      params: { tableName, filename: sanitizeFilename(filename) } 
    });
  },
  
  backupTable(tableName, filename) {
    return api.get('/tables/backup', { 
      params: { tableName, filename: sanitizeFilename(filename) } 
    });
  },
  
  fullBackup(filename) {
    return api.get('/tables/fullBackup', { 
      params: { filename: sanitizeFilename(filename) } 
    });
  },
  
  loadBackup(file) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/tables/loadBackup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  getTableColumns(tableName) {
    return this.executeCustomQuery(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}'
    `)
    .then(response => {
      // Преобразуем ответ в массив названий колонок
      if (response.data && Array.isArray(response.data)) {
        return {
          columns: response.data.map(col => col.column_name),
          success: true
        };
      }
      return { columns: [], success: false };
    })
    .catch(error => {
      console.error('Error fetching table columns:', error);
      return { columns: [], success: false, error: error.message };
    });
  },
  
  deleteRow(tableName, id) {
    return api.delete('/tables/deleteRow', { params: { tableName, id } });
  },
  
  getClientsWithLastNameIva() {
    return this.executePredefinedQuery('clients_with_last_name_Iva');
  },
  
  getClientsWithCars() {
    return this.executePredefinedQuery('clients_with_cars');
  },
  
  getYoungClientsCount() {
    return this.executePredefinedQuery('young_clients_count');
  },
  
  
  getCarsAudiAfter2015() {
    return this.executePredefinedQuery('cars_audi_after_2015');
  },
  
  getCarCountByBrand() {
    return this.executePredefinedQuery('car_count_by_brand');
  },
  
  
  getStosWorkingHoursAndAddress() {
    return this.executePredefinedQuery('stos_working_hours_and_address');
  },
  
  getTop3StosByEmployeeCount() {
    return this.executePredefinedQuery('top3_stos_by_employee_count');
  },
  
  
  getEmployeesHighSalaryStreetL() {
    return this.executePredefinedQuery('employees_high_salary_street_L');
  },
  
  getEmployeesLowSalaryHighOrderAmount() {
    return this.executePredefinedQuery('employees_low_salary_high_order_amount');
  },
  
  getEmployeesWithAboveAverageSalary() {
    return this.executePredefinedQuery('employees_with_above_average_salary');
  },
  
  
  getCompletedOrdersWithStreetAddress() {
    return this.executePredefinedQuery('completed_orders_with_street_address');
  },
  
  getIncompleteOrders() {
    return this.executePredefinedQuery('incomplete_orders');
  },
  
  getMostExpensiveOrder() {
    return this.executePredefinedQuery('most_expensive_order');
  },
  
  getTotalCompletedOrdersSum() {
    return this.executePredefinedQuery('total_completed_orders_sum');
  },
  
  
  getSparePartsInExpensiveOrders() {
    return this.executePredefinedQuery('spare_parts_in_expensive_orders');
  },
  
  getSparePartsWithLowStock() {
    return this.executePredefinedQuery('spare_parts_with_low_stock');
  },
  
  getTotalInventoryValue() {
    return this.executePredefinedQuery('total_inventory_value');
  },
  
  
  getAverageServiceCostByCategory() {
    return this.executePredefinedQuery('average_service_cost_by_category');
  },
  
  getTop5Services() {
    return this.executePredefinedQuery('top5_services');
  },
  
  
  getOrdersWithBoschParts() {
    return this.executePredefinedQuery('orders_with_bosch_parts');
  },
  
  getOrdersWithExpensiveServices() {
    return this.executePredefinedQuery('orders_with_expensive_services');
  },
  
  getStosHighSalaryEmployeesHighOrderAmount() {
    return this.executePredefinedQuery('stos_high_salary_employees_high_order_amount');
  },
  
  getEmployeesInStosWithHighOrderAmount() {
    return this.executePredefinedQuery('employees_in_stos_with_high_order_amount');
  },
  
  getStosWithHighSalaryEmployeesAndHighOrderAmount() {
    return this.executePredefinedQuery('stos_with_high_salary_employees_and_high_order_amount');
  },
  
  getStosWithEmployeesHighSalaryAndHighOrderAmount() {
    return this.executePredefinedQuery('stos_with_employees_high_salary_and_high_order_amount');
  }
};

export default apiService;
