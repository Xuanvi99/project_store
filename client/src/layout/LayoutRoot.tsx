import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../module/footer";
import Menu from "../module/menu";
import { useEffect } from "react";

function LayoutRoot({ menu }: { menu: "scroll" | "normal" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const checkPath = (pathname: string) => {
      if (pathname.includes("/user") && "/user/account/".includes(pathname)) {
        navigate("/user/account/profile");
      }
    };
    checkPath(pathname);
  }, [navigate, pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="w-full bg-light">
      <Menu type={menu}></Menu>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
}

export default LayoutRoot;
