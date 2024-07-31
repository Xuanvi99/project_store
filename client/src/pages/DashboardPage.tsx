import { useCallback, useEffect } from "react";
import { Header, Sidebar } from "../module/dashboard";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hook";
import { RootState } from "@/stores";

function DashboardPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAppSelector((state: RootState) => state.authSlice.user);

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
    <div className="w-full min-h-screen max-w-screen-2xl bg-light ">
      <DashboardPage.Header></DashboardPage.Header>
      <main className="min-h-[calc(100vh-80px)] content-page">
        <DashboardPage.SideBar></DashboardPage.SideBar>
        <section className="pt-[80px] min-h-full ml-auto w-[calc(100%-250px)] pb-10 ">
          <Outlet></Outlet>
        </section>
      </main>
    </div>
  );
}

DashboardPage.Header = Header;
DashboardPage.SideBar = Sidebar;

export default DashboardPage;
