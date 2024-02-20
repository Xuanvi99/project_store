import { useState } from "react";
import Heading from "../common/Heading";
import FormChangePassword from "./FormChangePassword";
import FormCheckPassword from "./FormCheckPassword";

function ChangePassword() {
  const [activeForm, setActiveForm] = useState<string>("checkPassword");

  const handleActiveForm = (activeForm: string) => {
    setActiveForm(activeForm);
  };
  return (
    <section className="max-w-[1000px] w-full bg-white rounded px-8">
      <Heading title="Đổi mật khẩu" className="flex flex-col justify-center">
        <p className="mt-1 text-sm text-gray">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </Heading>
      {activeForm === "checkPassword" && (
        <FormCheckPassword
          handleActiveForm={handleActiveForm}
        ></FormCheckPassword>
      )}
      {activeForm === "changePassword" && (
        <FormChangePassword
          handleActiveForm={handleActiveForm}
        ></FormChangePassword>
      )}
    </section>
  );
}

export default ChangePassword;
