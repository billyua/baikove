"use client";

import dynamic from "next/dynamic";

const CoordinateMapInner = dynamic(() => import("./CoordinateMapInner"), {
  ssr: false,
  loading: () => <p style={{ padding: "10px" }}>Завантаження карти...</p>,
});

export default function CoordinatePicker(props) {
  return <CoordinateMapInner {...props} />;
}
