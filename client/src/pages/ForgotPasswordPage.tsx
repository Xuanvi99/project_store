import { useEffect, useState } from "react";
import {
  FormCheckPhoneOrEmail,
  FormSendEmail,
  FormStepChangePassword,
} from "../module/auth";
import LayoutFormAuth from "../layout/LayoutFormAuth";
import { useLocation } from "react-router-dom";
import { useVerifyEmailMutation } from "../stores/service/otp.service";
import { isFetchBaseQueryError } from "../stores/helpers";

type TAccount = {
  phoneOrEmail: string;
  type: "email" | "phone" | "";
};

function ForgotPasswordPage() {
  const query = useLocation().search;
  const params = new URLSearchParams(query);
  let code = params.get("code");
  let email = params.get("email");
  if (code && email) {
    code = decodeURIComponent(code);
    email = decodeURIComponent(email);
  }

  const [verifyEmail, res] = useVerifyEmailMutation();

  const [account, setAccount] = useState<TAccount>({
    phoneOrEmail: "abc",
    type: "",
  });
  const [expired, setExpired] = useState<boolean | null>();

  const handleSetAccount = (
    phoneOrEmail: string,
    type: "email" | "phone" | ""
  ) => {
    setAccount({ phoneOrEmail, type });
  };

  useEffect(() => {
    const verify = async (email: string, code: string) => {
      try {
        const res = await verifyEmail({ email, code }).unwrap();
        if (!res.expired) {
          setAccount({ phoneOrEmail: email, type: "email" });
        }
        setExpired(res.expired);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    if (email && code) {
      verify(email, code);
    }
  }, [code, email, verifyEmail]);

  const handleBack = () => {
    setAccount({ phoneOrEmail: "", type: "" });
  };

  const handleError = () => {
    if (expired) {
      return "Mail xác minh đã hết hạn!";
    } else if (res.error && isFetchBaseQueryError(res.error)) {
      const data = res.error.data as { errMessage: string };
      return data.errMessage + "! Vui lòng nhập thông tin";
    }
    return "";
  };

  if (account && account.phoneOrEmail && account.type) {
    switch (account.type) {
      case "phone":
        return (
          <FormStepChangePassword
            phoneOrEmail={account.phoneOrEmail}
            onBack={handleBack}
          ></FormStepChangePassword>
        );
      case "email":
        if (email && code && !expired) {
          return (
            <FormStepChangePassword
              activeForm="2"
              phoneOrEmail={account.phoneOrEmail}
              onBack={handleBack}
            ></FormStepChangePassword>
          );
        } else {
          return (
            <LayoutFormAuth
              title="Đặt lại mật khẩu"
              className="flex items-center justify-center"
            >
              <FormSendEmail
                className="w-[500px] shadow-lg rounded-lg shadow-slate-500"
                email={account.phoneOrEmail}
              ></FormSendEmail>
            </LayoutFormAuth>
          );
        }
      default:
        break;
    }
  }

  return (
    <LayoutFormAuth
      title="Đặt lại mật khẩu"
      className="flex items-center justify-center"
    >
      <FormCheckPhoneOrEmail
        className="w-[500px] shadow-lg rounded-lg shadow-slate-500"
        handleSetAccount={handleSetAccount}
        errMessage={handleError()}
      ></FormCheckPhoneOrEmail>
    </LayoutFormAuth>
  );
}

export default ForgotPasswordPage;
