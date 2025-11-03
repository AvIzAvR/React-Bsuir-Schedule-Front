import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Переменная для хранения пароля суперпользователя
let superuserPassword = null;

const apiService = {
  // Установка пароля суперпользователя
  setSuperuserPassword(password) {
    superuserPassword = password;
  },

  // Проверка пароля суперпользователя
  validateSuperuserPassword(password) {
    return api.post('/tables/auth/superuser', null, { 
      params: { password } 
    });
  },

  // Добавление параметра суперпользователя к запросам
  addSuperuserParam(params = {}) {
    if (superuserPassword) {
      return { ...params, superuserPassword };
    }
    return params;
  },

  // Проверка, является ли таблица справочной (работает для всех пользователей)
  isTableReference(tableName) {
    return api.get('/tables/ref/check', { 
      params: { tableName } 
    });
  },

  // Получение всех таблиц
  getAllTables() {
    return api.get('/tables/getAllTables');
  },

  // Получение данных таблицы
  getTableData(tableName) {
    return api.get(`/tables/${tableName}`);
  },

  // Получение строки по ID
  getRow(tableName, id) {
    return api.get(`/tables/${tableName}/${id}`);
  },

  // Создание таблицы
  createTable(tableName, columns) {
    const params = this.addSuperuserParam({ tableName, columns });
    return api.post('/tables/create', null, { params });
  },

  // Обновление таблицы
  updateTable(tableName, columnName, newValue, condition) {
    const params = this.addSuperuserParam({ tableName, columnName, newValue, condition });
    return api.put('/tables/update', null, { params });
  },

  // Вставка строки
  insertRow(tableName, data) {
    const params = this.addSuperuserParam({ tableName });
    return api.post('/tables/insert', data, { params });
  },

  // Удаление таблицы
  dropTable(tableName) {
    const params = this.addSuperuserParam({ tableName });
    return api.delete('/tables/drop', { params });
  },

  // Добавление колонки
  addColumn(tableName, columnName, columnType) {
    const params = this.addSuperuserParam({ tableName, columnName, columnType });
    return api.post('/tables/addColumn', null, { params });
  },

  // Удаление колонки
  dropColumn(tableName, columnName) {
    const params = this.addSuperuserParam({ tableName, columnName });
    return api.delete('/tables/dropColumn', { params });
  },

  // Экспорт в Excel
  exportToExcel(tableName, filename) {
    return api.get('/tables/export', { 
      params: { tableName, filename: filename + '.xlsx' } 
    });
  },

  // Бэкап таблицы
  backupTable(tableName, filename) {
    const params = this.addSuperuserParam({ tableName, filename: filename + '.sql' });
    return api.get('/tables/backup', { params });
  },

  // Полный бэкап
  fullBackup(filename) {
    const params = this.addSuperuserParam({ filename: filename + '.sql' });
    return api.get('/tables/fullBackup', { params });
  },

  // Загрузка бэкапа
  loadBackup(file) {
    const formData = new FormData();
    formData.append('file', file);
    const params = this.addSuperuserParam({});
    return api.post('/tables/loadBackup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params
    });
  },

  // Удаление строки
  deleteRow(tableName, id) {
    const params = this.addSuperuserParam({ tableName, id });
    return api.delete('/tables/deleteRow', { params });
  },

  // Обновление строки
  updateRow(tableName, id, updates) {
    const params = this.addSuperuserParam({ tableName, id });
    return api.patch('/tables/updateRow', updates, { params });
  },

  // Выполнение пользовательского запроса
  executeCustomQuery(query) {
    return api.post('/queries/executeCustom', null, { params: { query } });
  },

  // Сохранение запроса
  saveCustomQuery(queryName, query) {
    return api.post('/queries/saveCustom', null, { params: { queryName, query } });
  },

  // Получение сохраненного запроса
  getSavedQuery(queryName) {
    return api.get('/queries/getCustom', { params: { queryName } });
  },

  // Методы для ref_table (только для суперпользователя)
  getRefTables() {
    const params = this.addSuperuserParam({});
    return api.get('/tables/ref/list', { params });
  },

  addTableToRef(tableName, isReference) {
    const params = this.addSuperuserParam({ tableName, isReference });
    return api.post('/tables/ref/add', null, { params });
  },

  removeTableFromRef(tableName) {
    const params = this.addSuperuserParam({ tableName });
    return api.delete('/tables/ref/remove', { params });
  },

  // Предопределенные запросы
  executePredefinedQuery(endpoint) {
    return api.get(`/queries/${endpoint}`);
  }
};

export default apiService;