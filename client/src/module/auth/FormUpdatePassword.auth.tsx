import { useEffect, useMemo, useState } from "react";
import { IconBack, IconError, IconTick, IconEye } from "../../components/icon";
import { cn } from "../../utils";
import { useAppDispatch, useToggle } from "../../hook";
import Button from "../../components/button/Button";
import Field from "../../components/fields";
import { Label } from "../../components/label";
import { InputForm } from "../../components/input";
import { useForm } from "react-hook-form";

import {
  useRegisterMutation,
  useUpdatePasswordMutation,
} from "../../stores/service/auth.service";
import { updateAuth } from "../../stores/reducer/authReducer";

type TProps = {
  account: string;
  handleActiveForm: (form: "1" | "2" | "3") => void;
  title: string;
  type: "create" | "change";
  codeEmail?: string;
};

function FormUpdatePassword({
  handleActiveForm,
  title,
  account,
  type,
  codeEmail,
}: TProps) {
  const [checkError, setCheckError] = useState<boolean>(true);

  const { toggle: showPW, handleToggle: handleShowPW } = useToggle();

  const handleCheckError = (isCheck: boolean) => {
    setCheckError(isCheck);
  };

  const [register] = useRegisterMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const dispatch = useAppDispatch();
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

  const onSubmit = async (data: { password: string }) => {
    if (type === "create") {
      await register({
        phoneOrEmail: account,
        password: data.password,
      })
        .unwrap()
        .then((res) => {
          if (res.user) {
            dispatch(updateAuth({ ...res, isLogin: true }));
            handleActiveForm("3");
          }
        });
    } else {
      await updatePassword({
        phoneOrEmail: account,
        password: data.password,
        code: codeEmail,
      })
        .unwrap()
        .then(() => handleActiveForm("3"));
    }
  };

  return (
    <div className="w-full checkCode">
      <div className="flex items-center py-7">
        <div
          onClick={() => handleActiveForm("1")}
          className="flex w-[80px] items-center justify-center font-bold cursor-pointer gap-x-2 text-blue hover:text-orange"
        >
          <IconBack size={25}></IconBack>
        </div>
        <div className=" w-[420px] pl-[80px] text-[20px] font-semibold">
          <h1>{title}</h1>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-2 px-[50px]"
      >
        <Field variant="flex-col">
          <Label htmlFor="password">Tạo mật khẩu mới:</Label>
          <div className="relative w-full">
            <InputForm
              control={control}
              type={showPW ? "text" : "password"}
              name="password"
              id="password"
              error={checkError}
              placeholder="Mật khẩu mới..."
              className={{
                input: dirtyFields.password
                  ? checkError
                    ? ""
                    : " border-green"
                  : "border-gray",
              }}
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
        <div className="my-5 text-center">
          <Button type="submit" variant="default" disabled={checkError}>
            Tiếp theo
          </Button>
        </div>
      </form>
    </div>
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

  const listError = useMemo(() => {
    return [
      { status: checkQuantity, text: "8-16 kí tự." },
      {
        status: checkLowerCapitalize,
        text: "Ít nhất một kí tự viết thường,viết hoa.",
      },
      { status: checkNumber, text: "Ít nhất một kí tự số." },
      { status: checkSpecial, text: "Không ký tự đặc biệt và khoảng trắng." },
    ];
  }, [checkLowerCapitalize, checkNumber, checkQuantity, checkSpecial]);

  return (
    <ul className="flex flex-col mt-3 text-sm gap-y-2">
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
      <span>
        {isDirtyField ? (
          !checkError ? (
            <IconError size={15}></IconError>
          ) : (
            <IconTick size={20}></IconTick>
          )
        ) : (
          ""
        )}
      </span>
      {text}
    </li>
  );
};

export default FormUpdatePassword;
