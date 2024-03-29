import { Outlet } from "react-router-dom";
import Footer from "../module/footer";
import Menu from "../module/menu";
import { useEffect } from "react";

function LayoutRoot() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className="w-full bg-light">
      <Menu></Menu>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
}

export default LayoutRoot;
