import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useLayoutEffect } from "react";
import { useAppSelector } from "../../../hook";
import { FormCheckCodeOtp } from "../../auth";

function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = useAppSelector((state) => state.authSlice.user);

  const query = useLocation().search;
  const params = new URLSearchParams(query);
  const account = params.get("account") || "";
  const phoneOrEmail = params.get("phoneOrEmail") || "";

  useLayoutEffect(() => {
    if (!account || !phoneOrEmail) {
      navigate(state.path, {
        state: {
          message: "Cập nhật " + phoneOrEmail + "thất bại!",
          isUpdate: false,
        },
        replace: true,
      });
    }
  }, [account, navigate, phoneOrEmail, state.path]);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate, user]);
  return (
    <div className="w-[500px] shadow-lg rounded-lg shadow-slate-500 ">
      <FormCheckCodeOtp
        account={account}
        phoneOrEmail={phoneOrEmail as "phone" | "email"}
        onBack={() => navigate(state.path, { replace: true })}
      ></FormCheckCodeOtp>
    </div>
  );
}

export default VerifyOtp;
