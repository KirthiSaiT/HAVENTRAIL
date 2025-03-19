import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ user }) => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4">
          Welcome, {user.role === 'admin' ? `Admin (${user.policeId})` : `User (${user.email})`}
        </h2>
        {user.role === 'admin' && (
          <p className="mb-4">Your Admin Key: <span className="font-mono">{user.adminKey}</span></p>
        )}
        <p className="mb-6">
          {user.role === 'admin'
            ? 'You can view and manage all crime reports from here.'
            : 'Report crimes and view your submissions from the dashboard.'}
        </p>
        <button
          onClick={goToDashboard}
          className={`${
            user.role === 'admin' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-6 py-3 rounded`}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Home;