import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import Field from "../../../components/fields";
import { InputForm } from "../../../components/input";
import {
  IconBack,
  IconError,
  IconEye,
  IconTick,
} from "../../../components/icon";
import { Button } from "../../../components/button";
import { cn } from "../../../utils";
import { useToggle } from "../../../hook";

function FormChangePassword({
  handleActiveForm,
}: {
  handleActiveForm: (activeForm: string) => void;
}) {
  const [checkError, setCheckError] = useState<boolean>(true);

  const { toggle: showPW, handleToggle: handleShowPW } = useToggle();

  const handleCheckError = (isCheck: boolean) => {
    setCheckError(isCheck);
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className="w-[500px] relative mx-auto my-10 flex flex-col items-center gap-y-7 py-10 shadow-sm shadow-black px-[50px]"
    >
      <div
        onClick={() => handleActiveForm("checkPassword")}
        className="absolute font-bold cursor-pointer top-5 left-5 gap-x-2 text-blue hover:text-orange"
      >
        <IconBack size={30}></IconBack>
      </div>
      <h1 className="text-xl text-center">Nhập Mật khẩu mới</h1>
      <Field variant="flex-row" className="w-full">
        <div className="relative w-full">
          <InputForm
            control={control}
            type={showPW ? "text" : "password"}
            name="password"
            id="password"
            value={watch("password")}
            placeholder="Mật khẩu mới..."
          />
          <IconEye
            size={20}
            onClick={handleShowPW}
            isOpenEye={showPW}
            className="absolute -translate-y-1/2 top-1/2 right-2"
          ></IconEye>
        </div>
      </Field>
      <ErrorPassword
        isDirtyField={dirtyFields.password ? true : false}
        password={watch("password")}
        onCheckError={handleCheckError}
      />
      <div className="mt-5 text-center">
        <Button type="button" variant="default" disabled={checkError}>
          Xác nhận
        </Button>
      </div>
    </form>
  );
}

const ErrorPassword = ({
  password,
  isDirtyField,
  onCheckError,
}: {
  password: string;
  isDirtyField: boolean;
  onCheckError: (isCheck: boolean) => void;
}) => {
  const [checkQuantity, setCheckQuantity] = useState<boolean>(false);
  const [checkLowerCapitalize, setCheckLowerCapitalize] =
    useState<boolean>(false);
  const [checkNumber, setCheckNumber] = useState<boolean>(false);
  const [checkSpecial, setCheckSpecial] = useState<boolean>(true);

  useEffect(() => {
    if (password) {
      setCheckQuantity(password.match(/^[a-zA-Z0-9\W]{8,16}$/) ? true : false);
      setCheckLowerCapitalize(
        password.match(/[a-z]{1,}/) && password.match(/[A-Z]{1,}/)
          ? true
          : false
      );
      setCheckNumber(password.match(/[0-9]{1,}/) ? true : false);
      setCheckSpecial(password.match(/^(?!.*\W)(?!.*\s)/) ? true : false);
    }
    onCheckError(
      checkQuantity && checkLowerCapitalize && checkNumber && checkSpecial
        ? false
        : true
    );
  }, [
    checkLowerCapitalize,
    checkNumber,
    checkQuantity,
    checkSpecial,
    onCheckError,
    password,
  ]);

  const listError = [
    { status: checkQuantity, text: "8-16 kí tự." },
    {
      status: checkLowerCapitalize,
      text: "Ít nhất một kí tự viết thường,viết hoa.",
    },
    { status: checkNumber, text: "Ít nhất một kí tự số." },
    { status: checkSpecial, text: "Không ký tự đặc biệt và khoảng trắng." },
  ];

  return (
    <ul className="flex flex-col items-start w-full gap-y-2">
      {listError.map((error, index) => {
        return (
          <ErrorItem
            key={index}
            isDirtyField={isDirtyField}
            checkError={error.status}
            text={error.text}
          />
        );
      })}
    </ul>
  );
};

const ErrorItem = ({
  text,
  isDirtyField,
  checkError,
}: {
  text: string;
  isDirtyField: boolean;
  checkError: boolean;
}) => {
  return (
    <li
      className={cn(
        "flex items-start gap-x-2",
        isDirtyField
          ? !checkError
            ? "text-red-600"
            : "text-green"
          : "text-gray"
      )}
    >
      {isDirtyField && (
        <span>
          {!checkError ? (
            <IconError size={15}></IconError>
          ) : (
            <IconTick size={20}></IconTick>
          )}
        </span>
      )}
      {text}
    </li>
  );
};

export default FormChangePassword;
