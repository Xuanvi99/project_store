import { useNavigate } from "react-router-dom";
import { IconBack } from "../../components/icon";
import { Button } from "../../components/button";
import Field from "../../components/fields";
import { Label } from "../../components/label";
import { InputForm } from "../../components/input";
import { ErrorInput } from "../../components/error";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import IconError from "../../components/icon/IconError";
import { useCheckUserMutation } from "../../stores/service/user.service";
import LoadingSpinner from "../../components/loading";
import { cn } from "../../utils";

type TFormCheckAccountProps = {
  className?: string;
  handleSetAccount: (
    phoneOrEmail: string,
    type: "email" | "phone" | ""
  ) => void;
  errMessage?: string;
};

const validatingSchema = Yup.object({
  phoneOrEmail: Yup.string()
    .required("Vui lòng điền vào mục này")
    .matches(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@gmail.com$|(0[3|5|7|8|9])+([0-9]{8})\b/,
      "Email hoặc số điện thoại không hợp lệ"
    ),
});

type formValues = Yup.InferType<typeof validatingSchema>;

function FormCheckPhoneOrEmail({
  handleSetAccount,
  className,
  errMessage,
}: TFormCheckAccountProps) {
  const navigate = useNavigate();

  const [checkUser, { isLoading }] = useCheckUserMutation();

  const [checkAccount, setCheckAccount] = useState<boolean>(true);

  const onSubmit = async (data: formValues) => {
    try {
      const res = await checkUser(data).unwrap();
      if (res.isCheckUser) {
        const type = data?.phoneOrEmail.match(/(0[3|5|7|8|9])+([0-9]{8})\b/)
          ? "phone"
          : "email";
        handleSetAccount(data?.phoneOrEmail, type);
      }
      setCheckAccount(res.isCheckUser);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<formValues>({
    defaultValues: {
      phoneOrEmail: "",
    },
    resolver: yupResolver(validatingSchema),
    mode: "onChange",
  });

  return (
    <div className={cn("w-full checkAccount", className)}>
      <div className="flex items-center py-7">
        <div
          onClick={() => navigate(-1)}
          className="flex w-[80px] items-center justify-center font-bold cursor-pointer gap-x-2 text-blue hover:text-orange"
        >
          <IconBack size={25}></IconBack>
        </div>
        <div className=" w-[420px] pl-[80px] text-[20px] font-semibold">
          <h1>Xác minh tài khoản</h1>
        </div>
      </div>
      {!checkAccount && (
        <div className="flex items-center w-[calc(500px-160px)] my-3 mx-auto px-2 py-2  text-sm text-red-600 border-red-600 rounded border-1 gap-x-2">
          <IconError size={15}></IconError>
          Không tìm thấy email hoặc số điện thoại
        </div>
      )}
      {errMessage && checkAccount && (
        <div className="flex items-center w-[calc(500px-160px)] mx-auto my-3 px-2 py-2  text-sm text-red-600 border-red-600 rounded border-1 gap-x-2">
          <IconError size={15}></IconError>
          {errMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col  gap-y-10 px-[80px] pb-14"
      >
        <Field variant="flex-col">
          <Label htmlFor="phoneOrEmail">Email/Số điện thoại:</Label>
          <InputForm
            control={control}
            type="text"
            name="phoneOrEmail"
            id="phoneOrEmail"
            placeholder="Nhập..."
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
            variant="default"
            className="w-[150px] flex justify-center mx-aut"
            disabled={
              errors["phoneOrEmail"] || !dirtyFields.phoneOrEmail ? true : false
            }
          >
            {isLoading ? <LoadingSpinner></LoadingSpinner> : "Kiểm tra"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormCheckPhoneOrEmail;
