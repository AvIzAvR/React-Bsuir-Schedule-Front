import React, { useState } from 'react';
import api from '../api';

const Login = ({ onLogin, showNotification, isSuperuser }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) {
      showNotification('Please enter password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.validateSuperuserPassword(password);
      if (response.data) {
        api.setSuperuserPassword(password);
        onLogin(true);
        showNotification('Superuser logged in successfully');
      } else {
        showNotification('Invalid password', 'error');
      }
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.setSuperuserPassword(null);
    onLogin(false);
    setPassword('');
    showNotification('Superuser logged out');
  };

  return (
    <div className="login-container">
      {isSuperuser ? (
        // Показываем только кнопку выхода, если пользователь авторизован
        <div className="login-form">
          <h3>Superuser Mode</h3>
          <button 
            onClick={handleLogout}
            className="button button-danger small"
          >
            Logout
          </button>
        </div>
      ) : (
        // Показываем форму входа, если пользователь не авторизован
        <form onSubmit={handleLogin} className="login-form">
          <h3>Superuser Login</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter superuser password"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="button button-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;