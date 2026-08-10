"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildDirectoryHref } from "../lib/directoryUrl";

export default function DirectorySearch({ currentParams }) {
  const router = useRouter();
  const [value, setValue] = useState(currentParams.q || "");
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Keep the input in sync when the search term changes from *outside*
    // this component — e.g. the "Очистити" reset link, or the back button.
    setValue(currentParams.q || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentParams.q]);

  useEffect(() => {
    // Don't navigate on mount — only when the admin actually types.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.push(buildDirectoryHref(currentParams, { q: value, page: "1" }));
    }, 400);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      placeholder="Пошук..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{
        padding: "8px 12px",
        fontSize: "16px",
        width: "100%",
        maxWidth: "400px",
        marginBottom: "16px",
        boxSizing: "border-box",
      }}
    />
  );
}
