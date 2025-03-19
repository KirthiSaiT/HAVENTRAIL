import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = ({ user }) => {
  const [crimes, setCrimes] = useState([]);
  const [crimeType, setCrimeType] = useState('');
  const [lat, setLat] = useState(13.0827);
  const [lng, setLng] = useState(80.2707);

  useEffect(() => {
    const fetchCrimes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/crimes', { withCredentials: true });
        setCrimes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCrimes();
  }, []);

  const handleReportCrime = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/auth/crime/report',
        { type: crimeType, lat, lng },
        { withCredentials: true }
      );
      setCrimeType('');
      setLat(13.0827);
      setLng(80.2707);
      const res = await axios.get('http://localhost:5000/auth/crimes', { withCredentials: true });
      setCrimes(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">
        Welcome, {user.role === 'admin' ? `Admin (${user.policeId})` : `User (${user.email})`}
      </h2>
      {user.role === 'admin' && (
        <p className="mb-4">Your Admin Key: {user.adminKey}</p>
      )}
      {user.role === 'user' && (
        <form onSubmit={handleReportCrime} className="mb-6">
          <h3 className="text-xl mb-2">Report a Crime</h3>
          <input
            type="text"
            placeholder="Crime Type (e.g., Theft)"
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            className="border p-2 mr-2 w-1/3"
            required
          />
          <input
            type="number"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value))}
            className="border p-2 mr-2 w-1/4"
            step="0.0001"
            required
          />
          <input
            type="number"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(parseFloat(e.target.value))}
            className="border p-2 mr-2 w-1/4"
            step="0.0001"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Report
          </button>
        </form>
      )}
      <MapContainer center={[13.0827, 80.2707]} zoom={13} style={{ height: '70vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {crimes.map((crime, idx) => (
          <Marker key={idx} position={[crime.lat, crime.lng]}>
            <Popup>{crime.type} - Reported on {new Date(crime.timestamp).toLocaleString()}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;