import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import './styles/safezone-map.css';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { toast } from 'react-hot-toast';

// Remove default marker icon
delete Icon.Default.prototype._getIconUrl;

// Set default icon options
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

// Create custom icon function
const createCustomIcon = (iconUrl) => {
  return new Icon({
    iconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const SafeZoneMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [watchId, setWatchId] = useState(null);
  const [sharedLocations, setSharedLocations] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [shareDuration, setShareDuration] = useState(15);
  const { user } = useAuth();

  const fetchSharedLocations = async () => {
    try {
      const response = await axios.get('/api/location/shared-with-me');
      setSharedLocations(response.data);
    } catch (error) {
      console.error('Error fetching shared locations:', error);
    }
  };

  const handleShareLocation = async () => {
    if (!userLocation) {
      toast.error('Please wait for location to be determined');
      return;
    }

    try {
      const response = await axios.post('/api/location/share', {
        lat: userLocation.lat,
        lng: userLocation.lng,
        duration: shareDuration,
        sharedWith: [] // TODO: Add logic to select users to share with
      });
      toast.success('Location shared successfully');
      setIsSharing(false);
    } catch (error) {
      toast.error('Error sharing location');
      console.error('Error sharing location:', error);
    }
  };

  // Sample safe zones data
  const safeZones = [
    {
      id: 1,
      name: 'Police Station',
      location: { lat: 28.6139, lng: 77.2090 },
      type: 'police',
      address: 'Near India Gate'
    },
    {
      id: 2,
      name: 'AIIMS Hospital',
      location: { lat: 28.5845, lng: 77.2165 },
      type: 'hospital',
      address: 'Safdarjung Enclave'
    },
    {
      id: 3,
      name: 'Women Safety Center',
      location: { lat: 28.6304, lng: 77.2176 },
      type: 'center',
      address: 'Connaught Place'
    }
  ];

  useEffect(() => {
    // Fetch shared locations
    if (user) {
      fetchSharedLocations();
    }

    // Request location access
    if (navigator.geolocation) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError(error.message);
          console.error('Error getting initial position:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      // Start watching position for continuous updates
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError(error.message);
          console.error('Error watching position:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );

      setWatchId(id);

      return () => {
        // Cleanup - stop watching position when component unmounts
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, [watchId]);

  const userMarkerIcon = createCustomIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png');

  return (
    <div className="safe-zone-map-container" style={{ height: '600px' }}>
      {locationError && (
        <div className="alert alert-warning">
          {locationError}
        </div>
      )}
      <div className="location-share-controls">
        <button onClick={() => setIsSharing(true)} className="share-location-btn">
          Share Location
        </button>
        {isSharing && (
          <div className="share-duration-picker">
            <label>Share Duration (minutes):</label>
            <input
              type="number"
              value={shareDuration}
              onChange={(e) => setShareDuration(e.target.value)}
              min="1"
              max="120"
            />
            <button onClick={handleShareLocation}>Share</button>
            <button onClick={() => setIsSharing(false)}>Cancel</button>
          </div>
        )}
      </div>
      <MapContainer
        center={userLocation || [28.6139, 77.2090]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userMarkerIcon}>
            <Popup>
              <strong>Your Location</strong>
              <p>Latitude: {userLocation.lat.toFixed(6)}</p>
              <p>Longitude: {userLocation.lng.toFixed(6)}</p>
              <p>Accuracy: {userLocation.accuracy} meters</p>
            </Popup>
          </Marker>
        )}

        {/* Safe zones markers */}
        {safeZones.map((zone) => (
          <Marker
            key={zone.id}
            position={[zone.location.lat, zone.location.lng]}
            icon={createCustomIcon(
              zone.type === 'police' 
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
                : zone.type === 'hospital'
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-purple.png'
            )}
          >
            <Popup>
              <h3>{zone.name}</h3>
              <p>Type: {zone.type}</p>
              <p>Address: {zone.address}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default SafeZoneMap;
