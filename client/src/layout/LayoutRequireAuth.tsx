import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hook";
import { useEffect } from "react";

function LayoutRequireAuth() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAppSelector((state) => state.authSlice.user);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate, pathname, user]);

  return <Outlet></Outlet>;
}

export default LayoutRequireAuth;
