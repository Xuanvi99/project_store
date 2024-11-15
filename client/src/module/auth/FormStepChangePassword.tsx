import { useState } from "react";
import { FormCheckCodeOTP, FormNotifyPWSuccess, FormUpdatePassword } from ".";
import LayoutFormAuth from "../../layout/LayoutFormAuth";
import { useLocation } from "react-router-dom";

type TProps = {
  phoneOrEmail: string;
  activeForm?: "1" | "2" | "3";
  onBack: () => void;
};

function FormStepChangePassword({
  phoneOrEmail,
  activeForm: index,
  onBack,
}: TProps) {
  const [activeForm, setActiveForm] = useState<"1" | "2" | "3">(
    index ? index : "1"
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
            onBack={onBack}
          ></FormUpdatePassword>
        );

      case "3":
        return (
          <FormNotifyPWSuccess
            type="change"
            account={phoneOrEmail}
            path={"/auth/login"}
          ></FormNotifyPWSuccess>
        );

      default:
        return (
          <FormCheckCodeOTP
            account={phoneOrEmail}
            phoneOrEmail="phone"
            handleActiveForm={handleActiveForm}
            onBack={onBack}
          ></FormCheckCodeOTP>
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
