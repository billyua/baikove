import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export default function SiteLayout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteHeader />
      <div style={{ flex: "1 0 auto" }}>{children}</div>
      <SiteFooter />
    </div>
  );
}
