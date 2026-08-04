"use client";

import dynamic from "next/dynamic";

const CemeteryMap = dynamic(() => import("./CemeteryMap"), {
  ssr: false,
  loading: () => (
    <p style={{ padding: "20px" }}>Завантаження карти...</p>
  ),
});

export default function MapLoader(props) {
  return <CemeteryMap {...props} />;
}
