import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Field from "@/components/fields";
import { Label } from "@/components/label";
import { InputForm } from "@/components/input";
import { ErrorInput } from "@/components/error";
import InputRadio from "@/components/input/InputRadio";
import { Button } from "@/components/button";
import LoadingSpinner from "@/components/loading";
import { useUpdateUserMutation } from "@/stores/service/user.service";
import { Fragment, useEffect, useState } from "react";
import { ModalNotification } from "@/components/modal";
import { IconError, IconSuccess } from "@/components/icon";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";

const validatingSchema = Yup.object({
  userName: Yup.string()
    .required("Vui lòng điền tên tài khoản")
    .min(8, "Độ dài ít nhất 8 ký tự")
    .max(16, "Độ dài không quá 16 ký tự"),
  gender: Yup.string().required().oneOf(["male", "female", "other"]),
  date: Yup.string().required("Vui lòng chọn ngày sinh"),
});

type formValues = Yup.InferType<typeof validatingSchema>;

function FormUpdateInfo() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<formValues>({
    defaultValues: {
      userName: user?.userName,
      gender: user?.gender,
      date: user?.date,
    },
    resolver: yupResolver(validatingSchema),
    mode: "onChange",
  });
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [updateUser, updateResult] = useUpdateUserMutation();

  const { isLoading, isSuccess, isError } = updateResult;

  const enCodePhone = (phone: string | undefined) => {
    if (!phone) {
      return "";
    }
    return phone.replace(phone.substring(3, 7), "****");
  };

  const enCodeEmail = (email: string | undefined) => {
    if (!email) {
      return "";
    }
    const nameEmail = email?.split("@")[0];
    let result = "";
    for (let i = 0; i < nameEmail.length; i++) {
      if (i < 2) {
        result += nameEmail[i];
      } else {
        result += "*";
      }
    }
    return result + "@" + email?.split("@")[1];
  };

  const handleCheckDate = () => {
    const dateMax = new Date();
    const dateMin = new Date("1900-01-01");
    const date = new Date(watch("date"));
    if (date > dateMax) {
      setError("date", {
        type: "max",
        message: "Ngày sinh không lớn hơn ngày hôm nay",
      });
    }
    if (date < dateMin) {
      setError("date", {
        type: "min",
        message: "Ngày sinh không nhỏ hơn năm 1900",
      });
    }
    return "";
  };

  const handleOpenModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (isSuccess || isError) {
      setOpenModal(true);
    }
  }, [isError, isSuccess]);

  const onSubmit = async (data: formValues) => {
    const formData = new FormData();
    for (const [keys, value] of Object.entries(data)) {
      formData.append(keys, value);
    }
    if (user) await updateUser({ id: user._id, body: formData }).unwrap();
  };

  return (
    <Fragment>
      <ModalNotification isOpen={openModal} onClick={handleOpenModal}>
        <div className="w-[300px] p-5 relative rounded-md overflow-hidden">
          <div className="absolute inset-0 z-50 bg-black opacity-75"></div>
          <div className="relative z-[60] flex flex-col items-center text-white gap-y-5">
            {isSuccess && (
              <span className={`${isSuccess ? "text-green" : "text-danger"}`}>
                {isSuccess ? (
                  <IconSuccess size={50}></IconSuccess>
                ) : (
                  <IconError size={50}></IconError>
                )}
              </span>
            )}
            <span className="text-center">
              {isSuccess ? (
                <p>Cập nhật thành công</p>
              ) : (
                <p>Cập nhật thất bại</p>
              )}
            </span>
          </div>
        </div>
      </ModalNotification>
      <form onSubmit={handleSubmit(onSubmit)} className="basis-3/5">
        <div className="flex justify-between gap-x-5">
          <div className="flex flex-col w-full text-sm gap-y-10">
            <Field className="grid grid-cols-[150px_300px] gap-x-5">
              <Label className="min-w-[150px] text-end">Tên tài khoản</Label>
              <InputForm
                control={control}
                name="userName"
                className={{ input: "py-1 text-sm max-w-[500px]" }}
              ></InputForm>
              <ErrorInput
                className="col-start-2 col-end-3"
                text={errors.userName?.message}
              ></ErrorInput>
            </Field>
            <Field variant="flex-row" className="gap-x-5">
              <Label className="w-[150px] text-end">Số điện thoại</Label>
              <div className="flex gap-x-3">
                <span>{enCodePhone(user?.phone)}</span>
                <Link
                  to="/user/account/phone"
                  className="underline cursor-pointer text-blue hover:text-orange"
                >
                  {user?.phone ? "Thay Đổi" : "Thêm"}
                </Link>
              </div>
            </Field>
            <Field variant="flex-row" className="gap-x-5">
              <Label className="w-[150px] text-end">Email</Label>
              <div className="flex gap-x-3">
                <span>{enCodeEmail(user?.email)}</span>
                <Link
                  to="/user/account/email"
                  className="underline cursor-pointer text-blue hover:text-orange"
                >
                  {user?.email ? "Thay Đổi" : "Thêm"}
                </Link>
              </div>
            </Field>
            <Field variant="flex-row" className="gap-x-5">
              <Label className="w-[150px] text-end">Giới tính</Label>
              <div className="flex items-center gap-x-5">
                <span className="flex items-center gap-x-2">
                  <InputRadio
                    control={control}
                    name="gender"
                    id="male"
                    value="male"
                    checked={watch("gender") === "male"}
                  ></InputRadio>
                  <label htmlFor="male">Nam</label>
                </span>
                <span className="flex items-center gap-x-2">
                  <InputRadio
                    control={control}
                    name="gender"
                    id="female"
                    value="female"
                    checked={watch("gender") === "female"}
                  ></InputRadio>
                  <label htmlFor="female">Nữ</label>
                </span>
                <span className="flex items-center gap-x-2">
                  <InputRadio
                    control={control}
                    name="gender"
                    id="other"
                    value="other"
                    checked={watch("gender") === "other"}
                  ></InputRadio>
                  <label htmlFor="other">Khác</label>
                </span>
              </div>
            </Field>
            <Field variant="flex-row" className="gap-x-5">
              <Label className="min-w-[150px] text-end">Ngày sinh</Label>
              <div className="flex flex-col gap-y-1">
                <InputForm
                  control={control}
                  name="date"
                  type="date"
                  value={watch("date")}
                  className={{ input: "w-auto py-1 text-sm" }}
                ></InputForm>
                <ErrorInput
                  text={errors.date ? errors.date.message : handleCheckDate()}
                ></ErrorInput>
              </div>
            </Field>
          </div>
        </div>
        <Button
          type="submit"
          variant="default"
          disabled={isLoading ? true : false}
          className={`mt-7 ml-24 min-w-[100px]`}
        >
          {isLoading ? (
            <LoadingSpinner className={"w-6 h-6"}></LoadingSpinner>
          ) : (
            "Cập nhật"
          )}
        </Button>
      </form>
    </Fragment>
  );
}

export default FormUpdateInfo;
