import { useState } from "react";
import LayoutFormAuth from "../../layout/LayoutFormAuth";
import { cn } from "../../utils";
import FormCheckCodeOtp from "./FormCheckCodeOtp.auth";
import { FormNotifyPWSuccess, FormUpdatePassword } from ".";

type TProps = {
  title: string;
  phoneOrEmail: string;
  onBack?: () => void;
  redirectUrl: string;
  indexForm?: "1" | "2" | "3";
};

function FormStepCreatePassword({
  phoneOrEmail,
  onBack,
  title,
  indexForm,
  redirectUrl,
}: TProps) {
  const [activeForm, setActiveForm] = useState<"1" | "2" | "3">(
    indexForm ? indexForm : "1"
  );
  const handleActiveForm = (form: "1" | "2" | "3") => {
    setActiveForm(form);
  };

  const selectForm = (activeForm: "1" | "2" | "3") => {
    switch (activeForm) {
      case "2":
        return (
          <FormUpdatePassword
            type="create"
            title="Tạo mật khẩu"
            account={phoneOrEmail}
            handleActiveForm={handleActiveForm}
          ></FormUpdatePassword>
        );

      case "3":
        return (
          <FormNotifyPWSuccess
            type="create"
            account={phoneOrEmail}
            path={redirectUrl}
          ></FormNotifyPWSuccess>
        );

      default:
        return (
          <FormCheckCodeOtp
            account={phoneOrEmail}
            phoneOrEmail="phone"
            handleActiveForm={handleActiveForm}
            onBack={onBack}
          ></FormCheckCodeOtp>
        );
    }
  };

  return (
    <LayoutFormAuth title={title}>
      <div className="w-full py-16">
        <ul className="w-[500px] mx-auto flex justify-between items-baseline">
          <StepItem
            step="1"
            title="Xác minh Otp"
            isActive={activeForm >= "1" ? true : false}
          ></StepItem>
          <li
            className={cn(
              "w-[85px] h-[2px] bg-grayCa relative",
              "after:content-[''] after:absolute after:right-0 after:-top-[3px] after:w-2 after:h-2 after:border-2 after:border-solid after:border-grayCa  after:block after:border-l-transparent after:border-b-transparent after:rotate-45 after:z-10 ",
              activeForm > "1"
                ? "bg-green66 after:border-green66 after:border-l-transparent after:border-b-transparent"
                : ""
            )}
          ></li>
          <StepItem
            step="2"
            title="Tạo mật khẩu"
            isActive={activeForm >= "2" ? true : false}
          ></StepItem>
          <li
            className={cn(
              "w-[85px] h-[2px] bg-grayCa relative",
              "after:content-[''] after:absolute after:right-0 after:-top-[3px] after:w-2 after:h-2 after:border-2 after:border-solid after:border-grayCa after:rotate-45 after:block after:border-l-transparent after:border-b-transparent  after:z-10 ",
              activeForm > "2"
                ? "bg-green66 after:border-green66 after:border-l-transparent after:border-b-transparent"
                : ""
            )}
          ></li>
          <StepItem
            step="3"
            title="Hoàn thành"
            isActive={activeForm === "3" ? true : false}
          ></StepItem>
        </ul>
        <div className="mt-16 w-[500px] mx-auto p-6 shadow-md shadow-slate-300">
          {selectForm(activeForm)}
        </div>
      </div>
    </LayoutFormAuth>
  );
}

const StepItem = ({
  step,
  title,
  isActive,
}: {
  step: string;
  title: string;
  isActive: boolean;
}) => {
  return (
    <li
      className={cn(
        "flex flex-col items-center text-xs text-grayCa gap-y-2",
        isActive ? "text-green66 " : ""
      )}
    >
      <span
        className={cn(
          "w-8 h-8 text-sm flex items-center justify-center rounded-full border-1 border-grayCa",
          isActive ? "bg-green66 text-white" : ""
        )}
      >
        {step}
      </span>
      <span>{title}</span>
    </li>
  );
};

export default FormStepCreatePassword;
