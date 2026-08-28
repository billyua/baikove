import L from "leaflet";

// This file is only ever imported by components that are dynamically loaded
// with ssr:false, so it's safe to construct Leaflet objects at module scope.

export const userLocationIcon = new L.DivIcon({
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
