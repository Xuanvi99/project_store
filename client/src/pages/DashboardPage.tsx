import { useEffect } from "react";
import { Header, Navbar } from "../module/dashboard";
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
      <Header></Header>
      <main className="min-h-[calc(100vh-80px)] content-page">
        <Navbar></Navbar>
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default DashboardPage;
