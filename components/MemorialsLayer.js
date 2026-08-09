"use client";

import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";

const baseCircleStyle = {
  radius: 6,
  color: "#933E2A",
  weight: 1,
  fillColor: "#933E2A",
  fillOpacity: 0.9,
};

const hoverCircleStyle = {
  ...baseCircleStyle,
  radius: 8,
  weight: 2,
};

function isValidPoint(feature) {
  const geometry = feature?.geometry;
  if (!geometry || geometry.type !== "Point") return false;
  const coords = geometry.coordinates;
  return (
    Array.isArray(coords) &&
    coords.length >= 2 &&
    typeof coords[0] === "number" &&
    typeof coords[1] === "number" &&
    Number.isFinite(coords[0]) &&
    Number.isFinite(coords[1])
  );
}

function pointToLayer(feature, latlng) {
  return L.circleMarker(latlng, baseCircleStyle);
}

function onEachFeature(feature, layer) {
  const name = feature.properties?.name ?? "";

  layer.bindTooltip(String(name), {
    permanent: true,
    direction: "top",
    offset: [0, -6],
    className: "memorial-label",
  });

  function setHover(hover) {
    layer.setStyle(hover ? hoverCircleStyle : baseCircleStyle);
    const tooltipEl = layer.getTooltip()?.getElement();
    if (tooltipEl) tooltipEl.classList.toggle("memorial-label-hover", hover);
  }

  // Hovering the dot itself.
  layer.on("mouseover", () => setHover(true));
  layer.on("mouseout", () => setHover(false));

  // Hovering the name label, which sits above the dot rather than on it,
  // so it needs its own listeners on the tooltip's actual DOM element.
  layer.on("tooltipopen", () => {
    const tooltipEl = layer.getTooltip()?.getElement();
    if (tooltipEl) {
      tooltipEl.addEventListener("mouseenter", () => setHover(true));
      tooltipEl.addEventListener("mouseleave", () => setHover(false));
    }
  });
}

export default function MemorialsLayer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/memorials.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        const invalid = (geojson.features || []).filter((f) => !isValidPoint(f));
        if (invalid.length > 0) {
          console.warn(
            `MemorialsLayer: skipping ${invalid.length} feature(s) with invalid geometry:`,
            invalid.map((f) => f.properties)
          );
        }
        setData(geojson);
      })
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  return (
    <GeoJSON
      data={data}
      filter={isValidPoint}
      pointToLayer={pointToLayer}
      onEachFeature={onEachFeature}
    />
  );
}
