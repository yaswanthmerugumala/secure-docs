import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SaveDocument from './components/SaveDocument';
import SearchDocument from './components/SearchDocument';
import './assets/App.css';

const App = () => {
  const [user, setUser] = useState(null);

  // Check if a user is already logged in when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });  // If token exists, set user state with token
    }
  }, []); // Only run this effect on mount

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token); // Save token in localStorage
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <>
      <Header user={user} onLogout={logoutUser} />
      <div className="container mt-5">
        <Routes>
          {/* If the user is not logged in, they are redirected to /login */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Auth routes */}
          <Route path="/login" element={<Login onLogin={loginUser} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/save"
            element={user ? <SaveDocument /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={user ? <SearchDocument /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
