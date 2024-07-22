import { useEffect } from "react";
import { Header, Sidebar } from "../module/dashboard";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hook";
import { RootState } from "@/stores";

function DashboardPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    } else {
      if (user.role !== "admin") {
        navigate("/", { replace: true });
      }
    }
  }, [navigate, user]);

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
