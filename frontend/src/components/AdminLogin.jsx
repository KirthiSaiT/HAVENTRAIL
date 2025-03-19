import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [policeId, setPoliceId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/auth/login/admin',
        { policeId, password },
        { withCredentials: true }
      );
      console.log('Admin login response:', response.data);
      navigate('/home', { replace: true }); // Redirect to home
    } catch (err) {
      console.error('Admin login error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Police ID"
            value={policeId}
            onChange={(e) => setPoliceId(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          No account? <Link to="/admin-register" className="text-green-500">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;