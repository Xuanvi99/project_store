import { useCallback, useEffect } from "react";
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

  useEffect(() => {
    if (!user) {
      handleLogin(pathname);
    } else {
      if (user.role !== "admin") {
        navigate("/", { replace: true });
      }
    }
  }, [handleLogin, navigate, pathname, user]);

  return (
    <div className="w-full min-h-screen max-w-screen-2xl bg-light">
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
