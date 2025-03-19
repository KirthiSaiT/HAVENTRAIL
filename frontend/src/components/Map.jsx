import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = () => {
  const [crimes, setCrimes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/crimes')
      .then(res => res.json())
      .then(data => setCrimes(data));
  }, []);

  return (
    <MapContainer center={[13.0827, 80.2707]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {crimes.map((crime, idx) => (
        <Marker key={idx} position={[crime.lat, crime.lng]}>
          <Popup>{crime.type}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;