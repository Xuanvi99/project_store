import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { FormCheckCodeOTP } from "@/module/auth";

function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const [searchParams] = useSearchParams();
  const account = searchParams.get("account") || "";
  const phoneOrEmail = searchParams.get("phoneOrEmail") || "";

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
      <FormCheckCodeOTP
        account={account}
        phoneOrEmail={phoneOrEmail as "phone" | "email"}
        onBack={() => navigate(state.path, { replace: true })}
      ></FormCheckCodeOTP>
    </div>
  );
}

export default VerifyOtp;
