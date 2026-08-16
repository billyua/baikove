export default function ImageTextRow({ src, alt, reverse = false, bordered = false, children }) {
  const image = (
    <img
      src={src}
      alt={alt}
      className={bordered ? "img-bordered" : undefined}
      style={{
        width: "100%",
        maxWidth: "280px",
        borderRadius: "8px",
        display: "block",
      }}
    />
  );

  const text = <div style={{ lineHeight: "1.6" }}>{children}</div>;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "24px",
        margin: "32px 0",
      }}
    >
      <div style={{ flex: "1 1 280px" }}>{reverse ? text : image}</div>
      <div style={{ flex: "1 1 280px" }}>{reverse ? image : text}</div>
    </div>
  );
}
