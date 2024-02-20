import IconSuccess from "../../components/icon/IconSuccess";
import { Button } from "../../components/button";
import { useEffect, useRef } from "react";

type TProps = {
  type: "change" | "create";
  path: string;
  account: string;
};

function FormNotifySuccess({ type, account, path }: TProps) {
  const timeRedirect = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let countDown = 10;
    const element = timeRedirect.current;
    const timer = setInterval(function () {
      if (element) {
        countDown--;
        element.textContent = `Bạn sẽ được chuyển đến trang Đăng nhập trong ${countDown} giây`;
        if (countDown === 0) {
          clearInterval(timer);
          window.location.replace(path);
        }
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [path, timeRedirect]);

  const notification = (account: string) => {
    if (account.includes("@gmail.com")) {
      return {
        title:
          "Bạn đã thành công đặt lại mật khẩu cho tài khoản XVStore với email",
        account: account,
      };
    } else {
      const match = account.slice(1, 10).match(/^(\d{3})(\d{3})(\d{3})$/);
      const phoneFormat = match
        ? "(+84) " + match[1] + " " + match[2] + " " + match[3]
        : account;
      return {
        title:
          type === "create"
            ? "Bạn đã tạo thành công tài khoản XVStore với số điện thoại"
            : "Bạn đã thành công đặt lại mật khẩu cho tài khoản XVStore với số điện thoại",
        account: phoneFormat,
      };
    }
  };
  return (
    <div className="w-full success_Password flex flex-col justify-center items-center gap-y-5 py-5 px-16">
      <h1 className="text-xl font-bold">
        {type === "create" ? "Đăng ký thành công!" : "Cập nhật thành công!"}
      </h1>
      <div className="text-green66">
        <IconSuccess size={100}></IconSuccess>
      </div>
      <div className="text-center">
        <p>{notification(account).title}</p>
        <span className="text-orange font-bold">
          {notification(account).account}
        </span>
      </div>
      <div ref={timeRedirect} className="text-center px-5">
        Bạn sẽ được chuyển đến trang Đăng nhập trong 10 giây
      </div>
      <Button
        variant="default"
        className="my-5"
        onClick={() => window.location.replace(path)}
      >
        Quay lại XVStore
      </Button>
    </div>
  );
}

export default FormNotifySuccess;
