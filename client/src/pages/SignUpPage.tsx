import { Link, useLocation } from "react-router-dom";
import { FormStepCreatePassword } from "../module/auth";
import { cn } from "../utils";
import Field from "../components/fields";
import { Label } from "../components/label";
import { InputForm } from "../components/input";
import { ErrorInput } from "../components/error";
import { Button, ButtonGoogle } from "../components/button";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCheckPhoneOrEmailMutation } from "../stores/service/user.service";
import LayoutAuth from "../layout/LayoutAuth";
import { useState } from "react";
import { ModalNotification } from "../components/modal";
import LoadingSpinner from "../components/loading";
import { IconAlert } from "../components/icon";

const validatingSchema = Yup.object({
  phoneOrEmail: Yup.string()
    .required("Vui lòng điền vào mục này.")
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại không hợp lệ"),
});

type formValue = Yup.InferType<typeof validatingSchema>;

function SignUpPage() {
  const query = useLocation().search;
  const { state: location } = useLocation();

  let pathname = "/";
  if (location && location["path"]) {
    pathname = location.path;
  }

  const [checkUser, { isLoading }] = useCheckPhoneOrEmailMutation();
  const [isCheckUser, setIsCheckUser] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, dirtyFields },
  } = useForm<formValue>({
    defaultValues: { phoneOrEmail: "" },
    resolver: yupResolver(validatingSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: formValue) => {
    try {
      const res = await checkUser(data).unwrap();
      if (!res.isCheckUser) {
        setAccount(data.phoneOrEmail);
        setIsCheckUser(false);
      } else {
        setOpenModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(false);
    setFocus("phoneOrEmail");
    reset({ phoneOrEmail: "" });
  };

  const handleCheckUser = () => {
    setIsCheckUser(!openModal);
  };

  if (!isCheckUser) {
    return (
      <FormStepCreatePassword
        title="Đăng ký"
        phoneOrEmail={account}
        redirectUrl={pathname}
        onBack={handleCheckUser}
      ></FormStepCreatePassword>
    );
  }

  return (
    <LayoutAuth>
      <ModalNotification isOpen={openModal} onClick={handleOpenModal}>
        <IconAlert size={50}></IconAlert>
        <span className="text-center">
          <p>Số điện thoại bạn nhập đã đăng ký !</p>
          <p> Bạn có thể đăng nhập</p>
        </span>
      </ModalNotification>
      <div className="flex flex-col justify-center w-full px-10 pt-16">
        <div className="flex flex-col items-center gap-y-2">
          <h1 className="text-2xl font-bold">Đăng ký</h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-5 gap-y-7"
        >
          <Field variant="flex-col">
            <Label htmlFor="phoneNumber"> Mật khẩu:</Label>
            <InputForm
              control={control}
              type="text"
              name="phoneOrEmail"
              id="phoneOrEmail"
              placeholder="Nhập số..."
              error={errors["phoneOrEmail"] ? true : false}
              className={{
                input:
                  dirtyFields.phoneOrEmail && !errors["phoneOrEmail"]
                    ? "border-green text-green"
                    : "",
              }}
            />
            <ErrorInput text={errors["phoneOrEmail"]?.message} />
          </Field>
          <div className="w-full">
            <Button
              type="submit"
              disabled={
                errors.phoneOrEmail || !dirtyFields.phoneOrEmail ? true : false
              }
              variant="default"
              className="w-[130px] flex justify-center mx-auto"
            >
              {isLoading ? <LoadingSpinner></LoadingSpinner> : "Đăng ký"}
            </Button>
          </div>
        </form>
        <div
          className={cn(
            "mt-10 w-full text-sm text-gray relative",
            "before:absolute before:w-full before:h-[1px] before:bg-gray before:inset-0",
            "after:content-['Hoặc'] after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[-10px] after:inline-block after:bg-white after:w-12 after:text-center"
          )}
        ></div>
        <div className="flex justify-center mt-5">
          <ButtonGoogle
            text="Đăng ký với email"
            pathname={pathname}
          ></ButtonGoogle>
        </div>
        <div className="mt-5 text-sm text-center text-gray">
          Bạn đã có tài khoản?
          <Link
            to={"/auth/login" + query}
            state={{ path: pathname }}
            className="ml-1 font-semibold text-blue hover:text-orange"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </LayoutAuth>
  );
}

export default SignUpPage;
