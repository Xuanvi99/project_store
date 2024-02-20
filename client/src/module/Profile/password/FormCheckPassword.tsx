import { useForm } from "react-hook-form";
import Heading from "../common/Heading";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputForm from "../../../components/input/InputForm";
import Field from "../../../components/fields/index";
import { Button } from "../../../components/button";
import { useToggle } from "../../../hook";
import { IconError, IconEye } from "../../../components/icon";
import { ErrorInput } from "../../../components/error";
import { useState } from "react";

const validationSchema = Yup.object({
  password: Yup.string().required("vui lòng nhập mật khẩu"),
});

type formValues = Yup.InferType<typeof validationSchema>;

function FormCheckPassword({
  handleActiveForm,
}: {
  handleActiveForm: (activeForm: string) => void;
}) {
  const { toggle: showPW, handleToggle: handleShowPW } = useToggle();
  const [checkPassword, setCheckPassword] = useState<boolean>(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<formValues>({
    defaultValues: {
      password: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = (data: formValues) => {
    console.log(data);
    handleActiveForm("changePassword");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[500px] mx-auto my-10 flex flex-col items-center gap-y-7 py-10 shadow-sm shadow-black px-[50px]"
    >
      <h1 className="text-xl text-center">Nhập Mật khẩu hiện tại</h1>

      {!checkPassword && (
        <div className="flex items-center w-full px-2 py-2 mt-2 text-sm text-red-600 border-red-600 rounded border-1 gap-x-2">
          <IconError size={15}></IconError>
          Mật khẩu không đúng. Vui lòng thử lại sau
        </div>
      )}

      <Field variant="flex-col" className="w-full">
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
      <Button
        type="submit"
        variant="default"
        disabled={errors["password"] ? true : false}
      >
        Xác minh
      </Button>
    </form>
  );
}

export default FormCheckPassword;
