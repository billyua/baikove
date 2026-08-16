export default function TwoImagesWithCaptions({
  leftSrc,
  leftAlt,
  leftCaption,
  leftBordered = false,
  rightSrc,
  rightAlt,
  rightCaption,
  rightBordered = false,
}) {
  const colStyle = { flex: "1 1 280px" };
  const captionStyle = {
    marginTop: "8px",
    marginBottom: 0,
    fontSize: "14px",
    color: "#666",
  };

  return (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", margin: "32px 0" }}>
      <div style={colStyle}>
        <img
          src={leftSrc}
          alt={leftAlt}
          className={leftBordered ? "img-bordered" : undefined}
          style={{ width: "100%", borderRadius: "8px", display: "block" }}
        />
        <p style={{ ...captionStyle, textAlign: "left" }}>{leftCaption}</p>
      </div>

      <div style={colStyle}>
        <img
          src={rightSrc}
          alt={rightAlt}
          className={rightBordered ? "img-bordered" : undefined}
          style={{ width: "100%", borderRadius: "8px", display: "block" }}
        />
        <p style={{ ...captionStyle, textAlign: "right" }}>{rightCaption}</p>
      </div>
    </div>
  );
}
