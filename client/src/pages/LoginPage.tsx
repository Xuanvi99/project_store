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
import { IconEye } from "../components/icon";
import LayoutAuth from "../layout/LayoutAuth";
import { useState } from "react";
import { ModalNotification } from "../components/modal";
import { useLoginMutation } from "../stores/service/auth.service";
import { updateAuth } from "../stores/reducer/authReducer";

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
  const params = new URLSearchParams(query);
  const redirectUrl = params.get("next");
  console.log("redirectUrl: ", redirectUrl);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();

  const { toggle: showPW, handleToggle: handleShowPW } = useToggle();

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    defaultValues: {
      phoneOrEmail: "",
      password: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenModal(false);
    setFocus("phoneOrEmail");
    reset({ phoneOrEmail: "", password: "" });
  };

  const onSubmit = async (data: FormValues) => {
    const res = await login(data).unwrap();
    if (res) {
      dispatch(updateAuth({ ...res, isLogin: true }));
      if (redirectUrl === "/" || redirectUrl === null) {
        navigate("/");
      } else {
        window.location.href = decodeURIComponent(redirectUrl);
      }
    }
  };

  return (
    <LayoutAuth>
      <ModalNotification isOpen={openModal} onClick={handleOpenModal}>
        <span className="text-center">
          <p>Tài Khoản hoặc mật khẩu không đúng</p>
        </span>
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
              className={{
                input:
                  dirtyFields.phoneOrEmail && !errors["phoneOrEmail"]
                    ? "border-green text-green"
                    : "",
              }}
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
              className={{
                input:
                  dirtyFields.password && !errors["password"]
                    ? "border-green "
                    : "",
              }}
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
              disabled={errors.valueOf() === true ? true : false}
              type="submit"
              variant="default"
            >
              Đăng nhập
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
          redirectUrl={redirectUrl ? decodeURIComponent(redirectUrl) : "/"}
        ></ButtonGoogle>
        <div className="mt-5 text-sm text-center text-gray">
          Bạn mới biết đến XVStore?
          <Link
            to={"/auth/sign_up" + query}
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
