import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "@/stores";
import {
  useSendOTPEmailMutation,
  useVerifyEmailMutation,
} from "@/stores/service/otp.service";
import { useUpdateUserMutation } from "@/stores/service/user.service";
import { useAppSelector } from "@/hook";
import { IconBack, IconError } from "@/components/icon";
import { cn } from "@/utils";
import { Button } from "@/components/button";
// import { authFireBase } from "@/fireBase/config";
import { TReqSms, useSendSmsOTPMutation } from "@/stores/service/sms.service";
import generateUniqueId from "generate-unique-id";
import { toast } from "react-toastify";

type TFormProps = {
  account: string;
  phoneOrEmail: "phone" | "email";
  handleActiveForm?: (form: "1" | "2" | "3") => void;
  onClick?: () => void;
  onBack?: () => void;
  className?: string;
  title?: string;
};

function FormCheckCodeOTP({
  account,
  handleActiveForm,
  phoneOrEmail,
  onBack,
  className,
  title = "Nhập mã xác minh",
}: TFormProps) {
  const [resend, setResend] = useState<boolean>(false);
  const [timeResend, setTimeResend] = useState<boolean>(false);
  const [CheckCode, setCheckCode] = useState<boolean>(false);
  const [codeOtpReceive, setCodeOtpReceive] = useState<string | undefined>("");
  const [codeOtpSend, setCodeOtpSend] = useState<string | undefined>("");
  const [errorOtp, setErrorOtp] = useState<string>("");
  const inputDivRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLParagraphElement>(null);
  const effectRun = useRef<boolean>(false);

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const navigate = useNavigate();
  const { state } = useLocation();

  const [sendOTPEmail] = useSendOTPEmailMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [updateUser] = useUpdateUserMutation();

  const [sendSmsOTP] = useSendSmsOTPMutation();

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append(phoneOrEmail, account);
    if (user) {
      await updateUser({ id: user._id, body: formData }).unwrap();
    }
  };

  const notifyVeryCode = (expired?: boolean, message?: string) => {
    navigate(state.path, {
      state: {
        message: message,
        isUpdate: !expired,
      },
      replace: true,
    });
  };

  // const handleOtpVerify = async () => {
  //   if (codeOtp) {
  //     if (phoneOrEmail === "phone") {
  //       const user = await window.confirmationResult.confirm(codeOtp);
  //       if (user) {
  //         if (handleActiveForm) {
  //           handleActiveForm("2");
  //         } else {
  //           handleUpdate();
  //           notifyVeryCode(false, "Cập nhật " + phoneOrEmail + " thành công");
  //         }
  //       } else {
  //         setErrorOtp("Mã xác minh không hợp lệ hoặc hết hạn");
  //       }
  //     } else {
  //       await verifyEmail({
  //         email: account,
  //         code: codeOtp,
  //       })
  //         .unwrap()
  //         .then((res) => {
  //           handleUpdate();
  //           notifyVeryCode(
  //             res.expired,
  //             "Cập nhật " + phoneOrEmail + " thành công"
  //           );
  //         })
  //         .catch((error) => {
  //           if (error.status === 404) {
  //             setErrorOtp("Mã xác minh không hợp lệ hoặc hết hạn");
  //           }
  //         });
  //     }
  //     resetOtp();
  //   }
  // };

  // const handleSendCodeFireBase = async (phoneNumber: string) => {
  //   const phone = "+84" + phoneNumber;
  //   const appVerifier = window.recaptchaVerifier;
  //   await signInWithPhoneNumber(authFireBase, phone, appVerifier)
  //     .then((confirmationResult) => {
  //       window.confirmationResult = confirmationResult;
  //     })
  //     .catch((error) => {
  //       console.log("error: ", error);
  //     });
  // };

  const handleOtpVerify = async () => {
    if (codeOtpReceive) {
      if (phoneOrEmail === "phone") {
        if (codeOtpReceive === codeOtpSend) {
          if (handleActiveForm) {
            handleActiveForm("2");
            setCodeOtpSend("");
          } else {
            handleUpdate();
            notifyVeryCode(false, "Cập nhật " + phoneOrEmail + " thành công");
          }
        } else {
          setErrorOtp("Mã xác minh không hợp lệ hoặc hết hạn");
        }
      } else {
        await verifyEmail({
          email: account,
          code: codeOtpReceive,
        })
          .unwrap()
          .then((res) => {
            handleUpdate();
            notifyVeryCode(
              res.expired,
              "Cập nhật " + phoneOrEmail + " thành công"
            );
          })
          .catch((error) => {
            if (error.status === 404) {
              setErrorOtp("Mã xác minh không hợp lệ hoặc hết hạn");
            }
          });
      }
      resetCodeOtp();
    }
  };
  const resetCodeOtp = useCallback(() => {
    const nodeRef = inputDivRef.current;
    let inputNext = nodeRef?.firstChild as HTMLInputElement;
    if (!inputNext) return;
    inputNext.disabled = false;
    inputNext.focus();
    for (let i = 0; i < 6; i++) {
      inputNext.value = "";
      inputNext = inputNext.nextElementSibling as HTMLInputElement;
    }
    setCodeOtpReceive("");
  }, []);

  const handleSendCodeOTPInfobip = async (phoneNumber: string) => {
    const phone = "84" + phoneNumber;
    const codeOtpSend = generateUniqueId({
      length: 6,
      useLetters: false,
      useNumbers: true,
    });
    setCodeOtpSend(codeOtpSend);
    const raw: TReqSms = {
      messages: [
        {
          destinations: [{ to: phone }],
          from: "XVStore",
          text: `XVStore: Nhập mã xác minh ${codeOtpSend}. Mã có hiệu lực trong 15 phút. Không chia sẻ mã với người khác`,
        },
      ],
    };

    await sendSmsOTP(raw)
      .unwrap()
      .then(() => {
        toast("Đã gửi mã xác minh đến bạn", { type: "success" });
      })
      .catch(() => {
        toast("Lỗi gửi mã xác minh", { type: "error" });
      });
  };

  useLayoutEffect(() => {
    // const sendOtpFireBase = (phoneNumber: string) => {
    //   try {
    //     if (!window.recaptchaVerifier) {
    //       window.recaptchaVerifier = new RecaptchaVerifier(
    //         authFireBase,
    //         "recaptcha-container",
    //         {
    //           size: "invisible",
    //           callback: function () {
    //             console.log("It's work");
    //           },
    //         }
    //       );
    //       handleSendCodeFireBase(phoneNumber);
    //     }
    //   } catch (error) {
    //     console.log("error", error);
    //   }
    // };

    if (!effectRun.current) {
      phoneOrEmail === "phone"
        ? handleSendCodeOTPInfobip(account)
        : sendOTPEmail({ email: account });
    }
    return () => {
      effectRun.current = true;
    };
  }, [account, phoneOrEmail, sendOTPEmail, sendSmsOTP]);

  useEffect(() => {
    const focusDiv = focusRef.current;
    const handleClickInput = () => {
      const nodeRef = inputDivRef.current;
      let inputTarget = nodeRef?.firstChild as HTMLInputElement;
      if (!inputTarget) return;
      for (let i = 0; i < 6; i++) {
        if (inputTarget.value === "") {
          inputTarget.focus();
          return;
        }
        inputTarget = inputTarget.nextElementSibling as HTMLInputElement;
      }
      const inputLastChild = nodeRef?.lastChild as HTMLInputElement;
      inputLastChild.focus();
      inputLastChild.select();
    };
    focusDiv?.addEventListener("click", handleClickInput);
    return () => {
      focusDiv?.removeEventListener("click", handleClickInput);
    };
  }, []);

  useEffect(() => {
    const nodeRef = inputDivRef.current;

    const handlePasteOtp = (event: Event) => {
      event.preventDefault();
      if ((event as ClipboardEvent).clipboardData) {
        const clipData = (event as ClipboardEvent).clipboardData;
        const pastedValue = clipData?.getData("text");
        if (pastedValue) {
          let inputOtp = nodeRef?.firstChild as HTMLInputElement;
          if (inputOtp) {
            for (let index = 0; index < 6; index++) {
              if (index < pastedValue.length) {
                inputOtp.value = pastedValue[index];
                inputOtp.disabled = false;
                inputOtp.focus();
              }
              inputOtp = inputOtp.nextElementSibling as HTMLInputElement;
            }
          }
        }
      }
    };

    const onInputCode = (event: KeyboardEvent) => {
      const inputTarget = event.target as HTMLInputElement;
      if (inputTarget.value.length > 1) {
        inputTarget.value = inputTarget.value[0];
        return;
      }
      if (inputTarget.value !== "") {
        const inputNext = inputTarget.nextElementSibling as HTMLInputElement;
        if (inputNext) {
          inputNext.focus();
          inputNext.select();
        } else {
          inputTarget.blur();
          const ValueOtp: string[] = [];
          if (nodeRef) {
            let input = nodeRef.firstChild as HTMLInputElement;
            if (!input) return;
            for (let i = 0; i < 6; i++) {
              ValueOtp.push(input.value);
              input = input.nextElementSibling as HTMLInputElement;
            }
          }
          setCodeOtpReceive(ValueOtp.join(""));
          setCheckCode(true);
        }
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        const prev = inputTarget.previousElementSibling as HTMLInputElement;
        if (prev) {
          prev.focus();
          prev.select();
          setCheckCode(false);
        } else {
          inputTarget.focus();
        }
      }
    };

    nodeRef?.firstChild?.addEventListener("paste", (event) =>
      handlePasteOtp(event)
    );
    nodeRef?.addEventListener("keyup", (event) => onInputCode(event));
    nodeRef?.addEventListener("click", () => {
      const nodeRef = inputDivRef.current;
      let inputTarget = nodeRef?.firstChild as HTMLInputElement;
      if (!inputTarget) return;
      for (let i = 0; i < 6; i++) {
        if (inputTarget.value === "") {
          inputTarget.focus();
          return;
        }
        inputTarget = inputTarget.nextElementSibling as HTMLInputElement;
      }
    });
    return () => {
      nodeRef?.removeEventListener("keyup", (event) => onInputCode(event));
      nodeRef?.firstChild?.removeEventListener("paste", (event) =>
        handlePasteOtp(event)
      );
    };
  }, []);

  useEffect(() => {
    let countDown = 60;
    const element = timeRef.current;
    const timer = setInterval(function () {
      if (element) {
        countDown--;
        element.textContent = `(${countDown})s`;
        if (countDown === 0) {
          clearInterval(timer);
          setResend(true);
          element.textContent = ``;
        }
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [timeResend]);

  useEffect(() => {
    const timer = setInterval(function () {
      setCodeOtpSend("");
      setErrorOtp("Mã xác minh đã hết hạn");
    }, 60000);
    return () => {
      clearInterval(timer);
    };
  }, [timeResend]);

  return (
    <div className={cn("w-full checkCode pb-10", className)}>
      <div id="recaptcha-container"></div>
      <div
        className={cn("flex items-center py-7", !onBack && "justify-center")}
      >
        {onBack && (
          <div
            onClick={onBack}
            className="flex w-[80px] items-center justify-center font-bold cursor-pointer gap-x-2 text-blue hover:text-orange"
          >
            <IconBack size={25}></IconBack>
          </div>
        )}
        <div className=" w-[420px] text-center text-[20px] font-semibold">
          <h1>{title}</h1>
        </div>
      </div>
      {errorOtp && (
        <div className="flex items-center w-[calc(500px-160px)] mx-auto my-3 px-2 py-2  text-sm text-red-600 border-red-600 rounded border-1 gap-x-2">
          <IconError size={15}></IconError>
          {errorOtp}
        </div>
      )}
      <Notification account={account} />
      <div className="relative w-full h-[50px] mt-10">
        <div
          className="flex items-center justify-center gap-x-2 "
          ref={inputDivRef}
        >
          {Array(6)
            .fill("0")
            .map((_, index) => (
              <input
                key={index}
                type="number"
                maxLength={1}
                name={`codeInput-${index}`}
                data-index={index}
                required
                className={cn(
                  `outline-none w-[50px] h-[50px] text-center text-3xl border-b-2 border-gray text-semibold focus:border-blue`,
                  errorOtp ? "border-red-600" : ""
                )}
              />
            ))}
        </div>
        <div
          ref={focusRef}
          className="absolute inset-0 z-30 w-full h-full "
        ></div>
      </div>
      <div className="mt-10 text-center">
        <Button
          type="button"
          variant="default"
          onClick={handleOtpVerify}
          disabled={!CheckCode}
          className={
            !CheckCode
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer opacity-100"
          }
        >
          Xác minh
        </Button>
      </div>
      <div className="flex justify-center py-2 mt-5 text-sm gap-x-1 ">
        <button
          type="button"
          onClick={() => {
            setTimeResend(!timeResend);
            setResend(false);
          }}
          disabled={!resend}
          className={`text-gray-400`}
        >
          Bạn vẫn chưa nhận được?
          <span
            onClick={() => handleSendCodeOTPInfobip(account)}
            className={`${resend ? "text-blue hover:text-blue " : "text-gray"}`}
          >
            Gửi lại
          </span>
        </button>
        <p ref={timeRef} className="text-gray">
          (60)s
        </p>
      </div>
    </div>
  );
}

const Notification = ({ account }: { account: string }) => {
  const message = function () {
    if (account.includes("@gmail.com")) {
      return {
        title: "Mã xác minh của bạn sẽ được gửi đến email",
        account: account,
      };
    } else {
      const match = account.slice(1, 10).match(/^(\d{3})(\d{3})(\d{3})$/);
      const phoneFormat = match
        ? "(+84) " + match[1] + " " + match[2] + " " + match[3]
        : account;
      return {
        title: "Mã xác minh của bạn sẽ được gửi bằng tin nhắn đến",
        account: phoneFormat,
      };
    }
  };

  return (
    <div className="flex flex-col items-center mt-5 text-sm gap-y-2">
      <span>{message().title}</span>
      <span className="font-bold underline text-orange">
        {message().account}
      </span>
    </div>
  );
};

export default FormCheckCodeOTP;
