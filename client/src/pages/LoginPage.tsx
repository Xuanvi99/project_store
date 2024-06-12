import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../utils";
import { Label } from "../components/label";
import Field from "../components/fields";
import { InputForm } from "../components/input";
import { ErrorInput } from "../components/error";
import { Button, ButtonGoogle } from "../components/button";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useToggle } from "../hook";
import { IconAlert, IconEye } from "../components/icon";
import LayoutAuth from "../layout/LayoutAuth";
import { useState } from "react";
import { ModalNotification } from "../components/modal";
import { useLoginMutation } from "../stores/service/auth.service";
import { updateAuth } from "../stores/reducer/authReducer";
import LoadingSpinner from "@/components/loading";

const validationSchema = Yup.object({
  phoneOrEmail: Yup.string()
    .required("Vui lòng điền vào mục này.")
    .matches(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@gmail.com$|(84|0[3|5|7|8|9])+([0-9]{8})\b/,
      "Email hoặc Số điện thoại không hợp lệ"
    ),
  password: Yup.string().required("Vui lòng điền vào mục này."),
});

type FormValues = Yup.InferType<typeof validationSchema>;

function LoginPage() {
  const query = useLocation().search;

  const { state: location } = useLocation();

  const pathname = location ? location.path : "/";

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { toggle: showPW, handleToggle: handleShowPW } = useToggle();

  const [statusError, setStatusError] = useState<number>(0);

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      phoneOrEmail: "",
      password: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });
  // console.log(errors, !Object.keys(errors).length);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenModal(false);
    setFocus("phoneOrEmail");
    reset({ phoneOrEmail: "", password: "" });
  };

  const onSubmit = async (data: FormValues) => {
    await login(data)
      .unwrap()
      .then((data) => {
        dispatch(updateAuth({ ...data, isLogin: true }));
      })
      .catch((error) => {
        setOpenModal(true);
        reset({ password: "" });
        setStatusError(error.status);
      });
    navigate(pathname, { replace: true });
  };

  const handleErrorLogin = (errorStatus: number) => {
    setOpenModal(true);
    setStatusError(errorStatus);
  };

  return (
    <LayoutAuth>
      <ModalNotification isOpen={openModal} onClick={handleOpenModal}>
        <div className="w-[300px] p-5 relative rounded-md overflow-hidden">
          <div className="absolute inset-0 z-50 bg-black opacity-75"></div>
          <div className="relative z-[60] flex flex-col items-center text-white gap-y-5">
            <IconAlert size={50}></IconAlert>
            <span className="text-center">
              {statusError === 400 && <p>Tài Khoản hoặc mật khẩu không đúng</p>}
              {statusError > 0 && <p>Lỗi đăng nhập! Vui lòng thủ lại</p>}
            </span>
          </div>
        </div>
      </ModalNotification>
      <div className="w-full h-full px-10 pt-5 bg-white text-grayDark">
        <div className="flex flex-col items-center mt-5 gap-y-2">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-5 gap-y-5"
        >
          <Field variant="flex-col">
            <Label htmlFor="phoneOrEmail">Email/Số điện thoại:</Label>
            <InputForm
              control={control}
              type="text"
              name="phoneOrEmail"
              id="phoneOrEmail"
              placeholder="Nhập email/số điện thoại..."
              error={errors["phoneOrEmail"] ? true : false}
            />
            <ErrorInput text={errors["phoneOrEmail"]?.message} />
          </Field>
          <Field variant="flex-col">
            <Label htmlFor="password"> Mật khẩu:</Label>
            <InputForm
              control={control}
              type={showPW ? "text" : "password"}
              name="password"
              id="password"
              placeholder="xxxxxx"
              error={errors["password"] ? true : false}
            >
              <IconEye
                size={20}
                onClick={handleShowPW}
                isOpenEye={showPW}
                className="absolute -translate-y-1/2 top-1/2 right-2"
              ></IconEye>
            </InputForm>
            <ErrorInput text={errors["password"]?.message} />
          </Field>
          <Link
            to={"/auth/forgot_password"}
            className="inline text-sm font-semibold text-blue hover:text-orange"
          >
            Quên mật khẩu?
          </Link>

          <div className="text-center">
            <Button
              disabled={
                !Object.keys(errors).length &&
                !!watch("phoneOrEmail") &&
                !!watch("password")
                  ? false
                  : true
              }
              type="submit"
              variant="default"
            >
              {isLoading ? (
                <LoadingSpinner className="w-6 h-6 border-2 border-white rounded-full animate-spin border-r-transparent"></LoadingSpinner>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </div>
        </form>
        <div
          className={cn(
            "mt-5 w-full text-sm text-gray relative",
            "before:absolute before:w-full before:h-[1px] before:bg-gray before:inset-0",
            "after:content-['Hoặc'] after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[-10px] after:inline-block after:bg-white after:w-12 after:text-center"
          )}
        ></div>
        <ButtonGoogle
          text="Đăng nhập với Google"
          pathname={pathname}
          handleErrorLogin={handleErrorLogin}
        ></ButtonGoogle>
        <div className="mt-5 text-sm text-center text-gray">
          Bạn mới biết đến XVStore?
          <Link
            to={"/auth/sign_up" + query}
            state={{ path: pathname }}
            className="ml-1 font-semibold text-blue hover:text-orange"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </LayoutAuth>
  );
}

export default LoginPage;
