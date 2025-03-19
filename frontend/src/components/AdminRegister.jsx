import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminRegister = () => {
  const [policeId, setPoliceId] = useState('');
  const [password, setPassword] = useState('');
  const [policeIdPhoto, setPoliceIdPhoto] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('policeId', policeId);
    formData.append('password', password);
    formData.append('policeIdPhoto', policeIdPhoto);

    try {
      await axios.post('http://localhost:5000/auth/register/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center">Admin Register</h2>
        <form onSubmit={handleRegister}>
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
          <input
            type="file"
            onChange={(e) => setPoliceIdPhoto(e.target.files[0])}
            className="border p-2 mb-4 w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Register as Admin
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/admin-login" className="text-green-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;