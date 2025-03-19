import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Map from './components/Map';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Register from './components/Register';
import AdminRegister from './components/AdminRegister';
import Home from './components/Home';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/profile', { withCredentials: true });
        console.log('Profile response:', res.data); // Debug log
        setUser(res.data);
      } catch (err) {
        console.error('Profile error:', err.response ? err.response.data : err.message);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
          <h1 className="text-3xl font-bold">Haventrail</h1>
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </header>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Register />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/admin-login"
            element={user ? <Navigate to="/home" /> : <AdminLogin />}
          />
          <Route
            path="/admin-register"
            element={user ? <Navigate to="/home" /> : <AdminRegister />}
          />
          <Route
            path="/home"
            element={user ? <Home user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={user ? <Map user={user} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;