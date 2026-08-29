export default function MapOptionsBar({
  showSections,
  onShowSectionsChange,
  showMemorials,
  onShowMemorialsChange,
  showMe,
  onShowMeChange,
}) {
  return (
    <div
      style={{
        background: "rgba(248, 248, 240, 0.9)",
        padding: "6px 12px",
        borderRadius: "6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        fontSize: "14px",
        flexShrink: 0,
      }}
    >
      <label className="map-option">
        <input
          type="checkbox"
          checked={showSections}
          onChange={onShowSectionsChange}
        />
        ділянки
      </label>

      <label className="map-option">
        <input
          type="checkbox"
          checked={showMemorials}
          onChange={onShowMemorialsChange}
        />
        об&apos;єкти
      </label>

      {/* Shown only on narrow (mobile) viewports — see .mobile-only-option in globals.css */}
      <label className="map-option mobile-only-option">
        <input type="checkbox" checked={showMe} onChange={onShowMeChange} />
        ви
      </label>
    </div>
  );
}
