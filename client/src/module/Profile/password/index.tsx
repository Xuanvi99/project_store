import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Heading from "../common/Heading";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector, useToggle } from "@/hook";
import { RootState } from "@/stores";
import { useChangePasswordMutation } from "@/stores/service/user.service";
import { IconError, IconEye, IconSuccess } from "@/components/icon";
import { ModalNotification } from "@/components/modal";
import { Label } from "@/components/label";
import { InputForm } from "@/components/input";
import { ErrorInput } from "@/components/error";
import LoadingSpinner from "@/components/loading";
import { Button } from "@/components/button";

const validationSchema = Yup.object({
  password1: Yup.string()
    .required("Vui lòng điền thông tin.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\W)(?!.*\s)[a-zA-Z\d]{8,16}$/,
      "Mật khẩu phải dài 8-16 ký tự, chứa ít nhất một ký tự viết hoa, một ký tự viết thường, một ký tự số và không ký tự đặc biệt và khoảng trắng."
    ),
  password2: Yup.string()
    .required("Vui lòng điền thông tin.")
    .test(
      "passwords-match",
      "Mật khẩu mới và Mật khẩu xác nhận k hông giống nhau",
      function (value) {
        return this.parent.password1 === value;
      }
    ),
});

type formValue = Yup.InferType<typeof validationSchema>;

function ChangePassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, dirtyFields },
  } = useForm<formValue>({
    defaultValues: {
      password1: "",
      password2: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { toggle: showPW1, handleToggle: handleShowPW1 } = useToggle();
  const { toggle: showPW2, handleToggle: handleShowPW2 } = useToggle();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [title, setTitle] = useState<React.ReactElement>(<></>);
  const handleOpenModal = useRef<() => void>();

  const [changePassword, { isLoading, isError }] = useChangePasswordMutation();

  const onSubmit = async (data: formValue) => {
    try {
      let content = <></>;
      await changePassword({
        id: user?._id as string,
        password: data.password1,
      })
        .unwrap()
        .then(() => {
          content = (
            <>
              <span className={`text-success`}>
                <IconSuccess size={50}></IconSuccess>
              </span>
              <p className="text-center">Thay đổi mật khẩu thành công</p>
            </>
          );
        })
        .catch((error) => {
          const data = error.data;
          if (data.isMatch) {
            content = (
              <>
                <span className={`text-danger`}>
                  <IconError size={50}></IconError>
                </span>
                <p className="text-center">
                  Mật khẩu mới không được trùng với mật khẩu hiện tại của bạn
                </p>
              </>
            );
          } else {
            content = (
              <>
                <span className={`text-danger`}>
                  <IconError size={50}></IconError>
                </span>
                <p className="text-center">Thay đổi mật khẩu thất bại</p>
              </>
            );
          }
        })
        .finally(() => {
          setTitle(content);
          setOpenModal(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  handleOpenModal.current = () => {
    setOpenModal(false);
    if (isError) {
      setFocus("password1");
      reset({ password1: "", password2: "" });
    } else {
      navigate("/user/account/profile");
    }
  };

  useLayoutEffect(() => {
    if (!state) {
      navigate("/verify/pw", {
        state: {
          phoneOrEmail: (user?.email as string) || (user?.phone as string),
        },
      });
    }
  }, [navigate, state, user?.email, user?.phone]);

  useEffect(() => {
    handleOpenModal.current;
  }, [handleOpenModal]);

  return (
    <section className="max-w-[1000px] w-full bg-white rounded px-8">
      <Heading className="flex flex-col items-start justify-center">
        <h1 className="text-lg font-medium">Đổi mật khẩu</h1>
        <p className="mt-1 text-sm text-gray">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </Heading>
      <div className="pt-10">
        <ModalNotification isOpen={openModal} onClick={handleOpenModal.current}>
          <div className="w-[300px] p-5 relative rounded-md overflow-hidden">
            <div className="absolute inset-0 z-50 bg-black opacity-75"></div>
            <div className="relative z-[60] flex flex-col items-center text-white gap-y-5">
              {title}
            </div>
          </div>
        </ModalNotification>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-y-3"
        >
          <div className="grid grid-cols-[150px_500px] gap-x-5 gap-y-3">
            <Label
              htmlFor="phoneNumber"
              className="flex items-center justify-end"
            >
              Mật khẩu mới:
            </Label>
            <InputForm
              control={control}
              type={showPW1 ? "text" : "password"}
              name="password1"
              id="password1"
              placeholder="xxxxxx"
              error={errors["password1"] ? true : false}
              className={{
                wrap: "max-w-[400px]",
              }}
            >
              <IconEye
                size={20}
                onClick={handleShowPW1}
                isOpenEye={showPW1}
                className="absolute -translate-y-1/2 top-1/2 right-2"
              ></IconEye>
            </InputForm>
            <ErrorInput
              className={`col-start-2 col-end-3 text-xs max-w-[400px] ${
                errors["password1"]?.message ? "" : "visible"
              }`}
              isIcon={false}
              text={errors["password1"]?.message}
            />
          </div>
          <div className="grid grid-cols-[150px_500px] gap-x-5 gap-y-3">
            <Label
              htmlFor="phoneNumber"
              className="flex items-center justify-end whitespace-nowrap"
            >
              Xác nhận mật khẩu:
            </Label>
            <InputForm
              control={control}
              type={showPW2 ? "text" : "password"}
              name="password2"
              id="password2"
              placeholder="xxxxxx"
              error={errors["password2"] ? true : false}
              className={{
                wrap: "max-w-[400px]",
              }}
            >
              <IconEye
                size={20}
                onClick={handleShowPW2}
                isOpenEye={showPW2}
                className="absolute -translate-y-1/2 top-1/2 right-2"
              ></IconEye>
            </InputForm>
            <ErrorInput
              className={`col-start-2 col-end-3 text-xs max-w-[400px] ${
                errors["password2"]?.message ? "" : "visible"
              }`}
              isIcon={false}
              text={errors["password2"]?.message}
            />
          </div>
          <Button
            disabled={
              errors.password2 ||
              errors.password1 ||
              !dirtyFields.password1 ||
              !dirtyFields.password2 ||
              isLoading
                ? true
                : false
            }
            type="submit"
            variant="default"
            className="min-w-[120px] flex justify-center "
          >
            {isLoading ? (
              <LoadingSpinner className={"w-6 h-6"}></LoadingSpinner>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default ChangePassword;
