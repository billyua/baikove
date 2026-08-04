import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export default function SiteLayout({ children }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
