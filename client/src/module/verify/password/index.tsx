import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToggle } from "@/hook";
import { useVerifyPasswordMutation } from "@/stores/service/user.service";
import { IconBack, IconEye } from "@/components/icon";
import Field from "@/components/fields";
import { InputForm } from "@/components/input";
import { ErrorInput } from "@/components/error";
import { Button } from "@/components/button";
import LoadingSpinner from "@/components/loading";

const validatingSchema = Yup.object({
  password: Yup.string().required("Vui lòng điền vào mục này"),
});

type formValues = Yup.InferType<typeof validatingSchema>;

function VerifyChangePw() {
  const navigate = useNavigate();
  const { state } = useLocation();
  if (!state) {
    navigate(-1);
  }
  const { toggle: showPW, handleToggle: handleShowPW } = useToggle();

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    setFocus,
    formState: { errors, dirtyFields },
  } = useForm<formValues>({
    defaultValues: {
      password: "",
    },
    resolver: yupResolver(validatingSchema),
    mode: "onChange",
  });

  const [verifyPassword, { isLoading }] = useVerifyPasswordMutation();

  const onSubmit = async (data: formValues) => {
    const phoneOrEmail = state.phoneOrEmail;
    const password = data.password;
    await verifyPassword({ phoneOrEmail, password })
      .unwrap()
      .then(() => {
        navigate("/user/account/password", {
          state: { isVerify: true },
          replace: true,
        });
      })
      .catch(() => {
        setError("password", {
          type: "error",
          message: "Mật khẩu không chính xác, vui lòng thử lại",
        });
        setValue("password", "");
        setFocus("password");
      });
  };

  return (
    <div className="w-[500px] shadow-lg rounded-lg shadow-slate-500 ">
      <div className="flex items-center py-7">
        <div
          onClick={() => navigate("/user/account/profile")}
          className="flex w-[80px] items-center justify-center font-bold cursor-pointer gap-x-2 text-blue hover:text-orange"
        >
          <IconBack size={25}></IconBack>
        </div>
        <div className=" w-[420px] pl-[80px] text-xl font-medium">
          <h1>Nhập mật khẩu XVStore</h1>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col  gap-y-10 px-[80px] pb-14"
      >
        <Field variant="flex-col">
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
        <div className="w-full ">
          <Button
            type="submit"
            variant="default"
            className="w-[150px] flex justify-center mx-auto"
            disabled={
              errors["password"] || !dirtyFields.password ? true : false
            }
          >
            {isLoading ? <LoadingSpinner></LoadingSpinner> : "Xác nhận"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default VerifyChangePw;
