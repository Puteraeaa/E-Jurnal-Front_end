import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import "leaflet-geosearch/dist/geosearch.css";

// Custom icon for the marker
const icon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ setLatLng }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLatLng(e.latlng); // Update parent component with latlng
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
};

const SearchControl = ({ provider, setLatLng }) => {
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      autoClose: true,
      retainZoomLevel: false,
      searchLabel: 'Enter address or place',
      keepResult: true,
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', function (result) {
      const { x, y } = result.location;
      setLatLng({ lat: y, lng: x });
    });

    // Cleanup function to remove the control on unmount
    return () => map.removeControl(searchControl);
  }, [map, provider, setLatLng]);

  return null;
};

const Map = ({ setLatLng }) => {
  const provider = new OpenStreetMapProvider();

  return (
    <MapContainer
      center={[-2.5, 118.0]} // Center on Indonesia
      zoom={5} // Default zoom level
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <SearchControl provider={provider} setLatLng={setLatLng} />
      <LocationMarker setLatLng={setLatLng} />
    </MapContainer>
  );
};

export default Map;
