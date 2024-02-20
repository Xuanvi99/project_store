import { useState } from "react";
import { FormCheckCodeOtp, FormNotifySuccess, FormUpdatePassword } from ".";
import LayoutFormAuth from "../../layout/LayoutFormAuth";
import { useLocation } from "react-router-dom";

type TProps = {
  phoneOrEmail: string;
  indexForm?: "1" | "2" | "3";
  onBack: () => void;
};

function FormStepChangePassword({ phoneOrEmail, indexForm, onBack }: TProps) {
  const [activeForm, setActiveForm] = useState<"1" | "2" | "3">(
    indexForm ? indexForm : "1"
  );
  const handleActiveForm = (form: "1" | "2" | "3") => {
    setActiveForm(form);
  };

  const query = useLocation().search;
  const params = new URLSearchParams(query);
  const code = params.get("code");

  const selectForm = (activeForm: "1" | "2" | "3") => {
    switch (activeForm) {
      case "2":
        return (
          <FormUpdatePassword
            type="change"
            title="Tạo mật khẩu"
            account={phoneOrEmail}
            handleActiveForm={handleActiveForm}
            codeEmail={code ? decodeURIComponent(code) : ""}
          ></FormUpdatePassword>
        );

      case "3":
        return (
          <FormNotifySuccess
            type="change"
            account={phoneOrEmail}
            path="http://localhost:5173/auth/login"
          ></FormNotifySuccess>
        );

      default:
        return (
          <FormCheckCodeOtp
            account={phoneOrEmail}
            handleActiveForm={handleActiveForm}
            onBack={onBack}
          ></FormCheckCodeOtp>
        );
    }
  };
  return (
    <LayoutFormAuth
      title="Đặt lại mật khẩu"
      className="flex items-center justify-center"
    >
      <div className="w-[500px] shadow-lg rounded-lg shadow-slate-500 ">
        {selectForm(activeForm)}
      </div>
    </LayoutFormAuth>
  );
}

export default FormStepChangePassword;
