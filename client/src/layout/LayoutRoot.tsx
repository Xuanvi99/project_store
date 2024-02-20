import { Outlet } from "react-router-dom";
import Footer from "../module/footer";
import Menu from "../module/menu";

function LayoutRoot() {
  return (
    <div className="w-full bg-light">
      <Menu></Menu>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
}

export default LayoutRoot;
