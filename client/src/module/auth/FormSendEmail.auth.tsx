import { useNavigate } from "react-router-dom";
import { IconBack, IconEmail } from "../../components/icon";
import { Button } from "../../components/button";
import { useSendEmailMutation } from "../../stores/service/otp.service";
import { useLayoutEffect, useRef } from "react";
import { cn } from "../../utils";

function FormSendEmail({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const [sendEmail] = useSendEmailMutation();
  const effectRun = useRef(false);

  useLayoutEffect(() => {
    const postSendEmail = async (email: string) => {
      try {
        const res = await sendEmail({ email }).unwrap();
        console.log(res);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    if (!effectRun.current) {
      postSendEmail(email);
    }
    return () => {
      effectRun.current = true;
    };
  }, [email, sendEmail]);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center py-7">
        <div
          onClick={() => navigate(-1)}
          className="flex w-[80px] items-center justify-center font-bold cursor-pointer gap-x-2 text-blue hover:text-orange"
        >
          <IconBack size={25}></IconBack>
        </div>
        <div className=" w-[420px] pl-[100px] text-[20px] font-semibold">
          <h1>Đặt lại mật khẩu</h1>
        </div>
      </div>
      <div className="w-[500px] shadow-lg rounded-lg shadow-slate-500 ">
        <div className="flex flex-col px-[80px] pb-14">
          <div className="w-full">
            <div className="max-w-[120px] mx-auto">
              <IconEmail></IconEmail>
            </div>
          </div>
          <div className="flex flex-col items-center mt-5 mb-12 text-sm">
            <span>Mã xác minh đã được gửi đến địa chỉ email</span>
            <span className="font-bold text-orange">{email}</span>
            <span>Vui lòng xác minh.</span>
          </div>
          <Button
            variant="default"
            type="button"
            onClick={() => navigate("/auth/login")}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormSendEmail;
