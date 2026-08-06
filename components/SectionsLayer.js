"use client";

import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";

const baseStyle = {
  color: "#933E2A",
  weight: 1.5,
  fillColor: "#933E2A",
  fillOpacity: 0.04,
};

const hoverStyle = {
  ...baseStyle,
  weight: 3,
  fillOpacity: 0.12,
};

export default function SectionsLayer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/sections.geojson")
      .then((res) => res.json())
      .then(setData)
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

  return <GeoJSON data={data} style={() => baseStyle} onEachFeature={onEachFeature} />;
}
