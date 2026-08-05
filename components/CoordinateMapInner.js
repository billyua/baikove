"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
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

export default function CoordinateMapInner({ latitude, longitude, onChange }) {
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
