import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hook";
import { useLayoutEffect } from "react";

function LayoutRequireAuth() {
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.authSlice.user);

  useLayoutEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  return <Outlet></Outlet>;
}

export default LayoutRequireAuth;
