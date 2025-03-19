import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Map from './components/Map';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Register from './components/Register';
import AdminRegister from './components/AdminRegister';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/profile', { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-center p-4">Haventrail</h1>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route
            path="/dashboard"
            element={user ? <Map /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;