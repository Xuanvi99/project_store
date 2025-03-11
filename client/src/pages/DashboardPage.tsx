import { useCallback, useLayoutEffect } from "react";
import { Main, Sidebar } from "../module/dashboard";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelectorAuthSlice } from "@/hook";

function DashboardPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelectorAuthSlice();

  const handleLogin = useCallback(
    (pathname: string) => {
      const query = encodeURIComponent(
        import.meta.env.VITE_DOMAIN_CLIENT + pathname
      );
      navigate("/auth/login?next=" + query, { state: { path: pathname } });
    },
    [navigate]
  );

  useLayoutEffect(() => {
    if (!user) {
      handleLogin(pathname);
    } else {
      if (user.role !== "admin") {
        navigate("/", { replace: true });
      }
    }
  }, [handleLogin, navigate, pathname, user]);
  //max-w-screen-2xl
  return (
    <div className="w-screen min-h-screen bg-light">
      <DashboardPage.SideBar></DashboardPage.SideBar>
      <DashboardPage.Main>
        <Outlet></Outlet>
      </DashboardPage.Main>
    </div>
  );
}

DashboardPage.Main = Main;
DashboardPage.SideBar = Sidebar;

export default DashboardPage;
