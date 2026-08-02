"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker icons reference image files in a way that breaks
// under Next.js's bundler. Point them at a CDN instead so pins render correctly.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function CemeteryMap({ graves, center, zoom, highlightId }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "600px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {graves.map((grave) => (
        <Marker
          key={grave.id}
          position={[grave.latitude, grave.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <strong>
              {grave.last_name} {grave.first_name}
            </strong>
            <br />
            {grave.birth_year}–{grave.death_year}
            <br />
            {grave.occupation}
            <br />
            <Link href={`/grave/${grave.id}`}>Переглянути сторінку →</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
