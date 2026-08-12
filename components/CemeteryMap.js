"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import SectionsLayer from "./SectionsLayer";
import MemorialsLayer from "./MemorialsLayer";
import SectionWidget from "./SectionWidget";

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

const highlightIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function GraveMarker({ grave, isHighlighted }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (isHighlighted && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isHighlighted]);

  return (
    <Marker
      position={[grave.latitude, grave.longitude]}
      icon={isHighlighted ? highlightIcon : markerIcon}
      ref={markerRef}
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
        <Link href={`/grave/${grave.slug}`}>Переглянути сторінку →</Link>
      </Popup>
    </Marker>
  );
}

export default function CemeteryMap({ graves, center, zoom, highlightSlug }) {
  const [showSections, setShowSections] = useState(true);
  const [showMemorials, setShowMemorials] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);

  function handleSectionClick(sectionNumber) {
    const gravesInSection = graves.filter(
      (g) => g.grave_section && String(g.grave_section).trim() === String(sectionNumber).trim()
    );

    if (gravesInSection.length === 0) {
      // Setting to null when it's already null is a no-op re-render-wise,
      // so this is safe to call unconditionally — and unlike reading
      // selectedSection here, it can't be tripped up by a stale closure
      // (the click handler is attached once when the section layer loads).
      setSelectedSection(null);
      return;
    }

    setSelectedSection(sectionNumber);
  }

  const sectionGraves = selectedSection
    ? graves
        .filter(
          (g) =>
            g.grave_section &&
            String(g.grave_section).trim() === String(selectedSection).trim()
        )
        .sort((a, b) => a.last_name.localeCompare(b.last_name, "uk"))
    : [];

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "10px",
          maxHeight: "580px",
        }}
      >
        <div
          style={{
            background: "rgba(248, 248, 240, 0.9)",
            padding: "6px 10px",
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          <label
            style={{
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showSections}
              onChange={(e) => setShowSections(e.target.checked)}
            />
            Показати ділянки
          </label>
          <label
            style={{
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showMemorials}
              onChange={(e) => setShowMemorials(e.target.checked)}
            />
            Показати об&apos;єкти
          </label>
        </div>

        {selectedSection && sectionGraves.length > 0 && (
          <SectionWidget
            sectionNumber={selectedSection}
            graves={sectionGraves}
            onClose={() => setSelectedSection(null)}
          />
        )}
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "600px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showSections && <SectionsLayer onSectionClick={handleSectionClick} />}
        {showMemorials && <MemorialsLayer />}

        {graves.map((grave) => (
          <GraveMarker
            key={grave.slug}
            grave={grave}
            isHighlighted={grave.slug === highlightSlug}
          />
        ))}
      </MapContainer>
    </div>
  );
}
