"use client";

import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";

const baseStyle = {
  color: "#933E2A",
  weight: 1.5,
  opacity: 0.5,
  dashArray: "1, 6",
  lineCap: "round",
  fillColor: "#933E2A",
  fillOpacity: 0.04,
};

const hoverStyle = {
  ...baseStyle,
  weight: 3,
  fillOpacity: 0.12,
};

// How many levels of nested arrays each geometry type should have before
// reaching a raw [lng, lat] pair.
const DEPTH_BY_TYPE = {
  Point: 0,
  MultiPoint: 1,
  LineString: 1,
  MultiLineString: 2,
  Polygon: 2,
  MultiPolygon: 3,
};

function isValidCoordArray(arr, depth) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  if (depth === 0) {
    return (
      arr.length >= 2 &&
      typeof arr[0] === "number" &&
      typeof arr[1] === "number" &&
      Number.isFinite(arr[0]) &&
      Number.isFinite(arr[1])
    );
  }
  return arr.every((item) => isValidCoordArray(item, depth - 1));
}

// Guards against features with missing/empty/malformed geometry, which
// otherwise crash Leaflet entirely ("latlngs not passed") and take the
// whole map down with them. Invalid features are simply skipped.
function hasValidGeometry(feature) {
  const geometry = feature?.geometry;
  if (!geometry || !geometry.type || !geometry.coordinates) return false;
  const depth = DEPTH_BY_TYPE[geometry.type];
  if (depth === undefined) return false;
  return isValidCoordArray(geometry.coordinates, depth);
}

export default function SectionsLayer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/sections.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        const invalid = (geojson.features || []).filter(
          (f) => !hasValidGeometry(f)
        );
        if (invalid.length > 0) {
          console.warn(
            `SectionsLayer: skipping ${invalid.length} feature(s) with invalid geometry:`,
            invalid.map((f) => f.properties)
          );
        }
        setData(geojson);
      })
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  function onEachFeature(feature, layer) {
    const number = feature.properties?.section_nu ?? feature.properties?.id ?? "";

    layer.bindTooltip(String(number), {
      permanent: true,
      direction: "center",
      className: "section-label",
    });

    layer.on("mouseover", () => {
      layer.setStyle(hoverStyle);
      const tooltipEl = layer.getTooltip()?.getElement();
      if (tooltipEl) tooltipEl.classList.add("section-label-hover");
    });

    layer.on("mouseout", () => {
      layer.setStyle(baseStyle);
      const tooltipEl = layer.getTooltip()?.getElement();
      if (tooltipEl) tooltipEl.classList.remove("section-label-hover");
    });
  }

  return (
    <GeoJSON
      data={data}
      filter={hasValidGeometry}
      style={() => baseStyle}
      onEachFeature={onEachFeature}
    />
  );
}
