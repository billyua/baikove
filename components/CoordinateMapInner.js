"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Reports the map's center back up every time the map is panned/zoomed.
function CenterTracker({ onChange }) {
  useMapEvents({
    move(e) {
      const center = e.target.getCenter();
      onChange(center.lat, center.lng);
    },
  });
  return null;
}

// Recenters the map when latitude/longitude change from *outside* the map
// itself (e.g. the admin typed new values into the text fields).
function ViewSync({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    const current = map.getCenter();
    const latDiff = Math.abs(current.lat - latitude);
    const lngDiff = Math.abs(current.lng - longitude);
    // Small threshold avoids fighting with the map's own drag updates.
    if (latDiff > 0.000001 || lngDiff > 0.000001) {
      map.setView([latitude, longitude], map.getZoom(), { animate: false });
    }
  }, [latitude, longitude, map]);

  return null;
}

const userLocationIcon = new L.DivIcon({
  className: "",
  html: `<div style="
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #4285F4;
    border: 2px solid #fff;
    box-shadow: 0 0 4px rgba(0,0,0,0.5);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function CoordinateMapInner({ latitude, longitude, onChange }) {
  const [showMe, setShowMe] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);

  function handleShowMeChange(e) {
    const checked = e.target.checked;
    setShowMe(checked);
    setLocationError(null);

    if (!checked) return;

    if (!navigator.geolocation) {
      setLocationError("Геолокація не підтримується цим браузером.");
      setShowMe(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        setLocationError("Не вдалося визначити місцезнаходження.");
        setShowMe(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div
      style={{
        position: "relative",
        height: "250px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #ccc",
      }}
    >
      <label
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          zIndex: 1000,
          background: "rgba(248, 248, 240, 0.9)",
          padding: "4px 8px",
          borderRadius: "6px",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        <input type="checkbox" checked={showMe} onChange={handleShowMeChange} />
        Показати мене
      </label>

      {locationError && (
        <div
          style={{
            position: "absolute",
            top: "38px",
            right: "8px",
            zIndex: 1000,
            background: "#fee",
            color: "#a33",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            maxWidth: "200px",
          }}
        >
          {locationError}
        </div>
      )}

      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CenterTracker onChange={onChange} />
        <ViewSync latitude={latitude} longitude={longitude} />

        {showMe && userPosition && (
          <Marker position={userPosition} icon={userLocationIcon} interactive={false} />
        )}
      </MapContainer>

      {/* Fixed pin, always centered over the map regardless of pan/zoom —
          this represents the currently selected coordinates. */}
      <img
        src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "25px",
          height: "41px",
          marginLeft: "-12px",
          marginTop: "-41px",
          pointerEvents: "none",
          zIndex: 1000,
        }}
      />
    </div>
  );
}
