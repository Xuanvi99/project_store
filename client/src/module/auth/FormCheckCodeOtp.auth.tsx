import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../utils";
import { IconBack } from "../../components/icon";
import Button from "../../components/button/Button";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { authFireBase } from "../../fireBase/config";

type TFormProps = {
  account: string;
  handleActiveForm: (form: "1" | "2" | "3") => void;
  onBack?: () => void;
};

function FormCheckCodeOtp({ account, handleActiveForm, onBack }: TFormProps) {
  const [resend, setResend] = useState<boolean>(false);
  const [timeResend, setTimeResend] = useState<boolean>(false);
  const [CheckCode, setCheckCode] = useState<boolean>(false);
  const [codeOtp, setCodeOtp] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const inputDivRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLParagraphElement>(null);

  const handleSendCodeFireBase = (phoneNumber: string) => {
    const phone = "+84" + phoneNumber;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(authFireBase, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  useEffect(() => {
    const sendOtpFireBase = (phoneNumber: string) => {
      try {
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            authFireBase,
            "recaptcha-container",
            {
              size: "invisible",
              callback: function () {
                console.log("It's work");
              },
            }
          );
          handleSendCodeFireBase(phoneNumber);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    sendOtpFireBase(account);
  }, [account]);

  const resetOtp = useCallback(() => {
    const nodeRef = inputDivRef.current;
    let inputNext = nodeRef?.firstChild as HTMLInputElement;
    if (!inputNext) return;
    inputNext.disabled = false;
    inputNext.focus();
    for (let i = 0; i < 6; i++) {
      inputNext.value = "";
      inputNext = inputNext.nextElementSibling as HTMLInputElement;
    }
    setCodeOtp("");
  }, []);

  const handleOtpVerify = async () => {
    if (codeOtp) {
      console.log("codeOtp: ", codeOtp);
      console.log(window.confirmationResult);
      const user = await window.confirmationResult.confirm(codeOtp);
      if (user) {
        handleActiveForm("2");
      }
      resetOtp();
      setError("");
    }
  };

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
          setCodeOtp(ValueOtp.join(""));
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

  return (
    <div className="w-full checkCode">
      <div id="recaptcha-container"></div>
      <div className="flex items-center py-7">
        <div
          onClick={onBack}
          className="flex w-[80px] items-center justify-center font-bold cursor-pointer gap-x-2 text-blue hover:text-orange"
        >
          <IconBack size={25}></IconBack>
        </div>
        <div className=" w-[420px] pl-[80px] text-[20px] font-semibold">
          <h1>Nhập mã xác minh</h1>
        </div>
      </div>
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
                  error ? "border-red-600" : ""
                )}
              />
            ))}
        </div>
        <div
          ref={focusRef}
          className="absolute inset-0 z-30 w-full h-full "
        ></div>
      </div>
      <div className="mt-5 text-sm text-red-700">{error}</div>
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
            //   handleCheckMail();
            setTimeResend(!timeResend);
            setResend(false);
          }}
          disabled={!resend}
          className={`text-gray-400`}
        >
          Bạn vẫn chưa nhận được?
          <span
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

export default FormCheckCodeOtp;
