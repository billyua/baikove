export default function TwoImagesWithCaptions({
  leftSrc,
  leftAlt,
  leftCaption,
  rightSrc,
  rightAlt,
  rightCaption,
}) {
  const rowStyle = { display: "flex", gap: "24px", flexWrap: "wrap" };
  const colStyle = { flex: "1 1 280px" };

  return (
    <div style={{ margin: "32px 0" }}>
      <div style={rowStyle}>
        <div style={colStyle}>
          <img
            src={leftSrc}
            alt={leftAlt}
            style={{ width: "100%", borderRadius: "8px", display: "block" }}
          />
        </div>
        <div style={colStyle}>
          <img
            src={rightSrc}
            alt={rightAlt}
            style={{ width: "100%", borderRadius: "8px", display: "block" }}
          />
        </div>
      </div>

      <div style={{ ...rowStyle, marginTop: "8px" }}>
        <p style={{ ...colStyle, margin: 0, fontSize: "14px", color: "#666", textAlign: "left" }}>
          {leftCaption}
        </p>
        <p style={{ ...colStyle, margin: 0, fontSize: "14px", color: "#666", textAlign: "right" }}>
          {rightCaption}
        </p>
      </div>
    </div>
  );
}
