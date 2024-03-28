import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Field from "../../../../components/fields";
import { Label } from "../../../../components/label";
import { InputForm } from "../../../../components/input";
import { ErrorInput } from "../../../../components/error";
import InputRadio from "../../../../components/input/InputRadio";
import { Button } from "../../../../components/button";
import Heading from "../../common/Heading";
import { useAppDispatch, useAppSelector } from "../../../../hook";
import { Link } from "react-router-dom";
import {
  useGetProfileQuery,
  useUpdateUserMutation,
} from "../../../../stores/service/user.service";
import { updateAuth } from "../../../../stores/reducer/authReducer";
import LoadingSpinner from "../../../../components/loading";
import { ModalNotification } from "../../../../components/modal";
import { IconError, IconSuccess } from "../../../../components/icon";

const validatingSchema = Yup.object({
  userName: Yup.string()
    .required("Vui lòng điền tên tài khoản")
    .min(8, "Độ dài ít nhất 8 ký tự")
    .max(16, "Độ dài không quá 16 ký tự"),
  gender: Yup.string().required().oneOf(["male", "female", "other"]),
  date: Yup.string().required("Vui lòng chọn ngày sinh"),
});

type formValues = Yup.InferType<typeof validatingSchema>;

function FormInfoUser() {
  const user = useAppSelector((state) => state.authSlice.user);
  const dispatch = useAppDispatch();
  const [images, setImages] = useState([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const id = user ? user._id : "";
  const { data, status } = useGetProfileQuery(id, { skip: !id });

  const profile = data?.user;

  const [updateUser, updateResult] = useUpdateUserMutation();
  console.log("updateResult: ", updateResult);
  const { isLoading, isSuccess, isError } = updateResult;

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<formValues>({
    defaultValues: {
      userName: profile?.userName || user?.userName,
      gender: profile?.gender || user?.gender,
      date: profile?.date || user?.date,
    },
    resolver: yupResolver(validatingSchema),
    mode: "onChange",
  });

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

  const onChangeImage = (imageList: ImageListType) => {
    setImages(imageList as never[]);
  };

  const onSubmit = async (data: formValues) => {
    const formData = new FormData();
    for (const [keys, value] of Object.entries(data)) {
      formData.append(keys, value);
    }
    if (images.length > 0) {
      formData.append("avatar", images[0]["file"]);
    }
    if (user) {
      await updateUser({ id: user._id, body: formData }).unwrap();
    }
  };

  const handleOpenModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (isSuccess || isError) {
      console.log(isSuccess);
      setOpenModal(true);
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (data && status === "fulfilled") {
      dispatch(updateAuth({ user: data.user }));
    }
  }, [data, dispatch, status]);

  return (
    <Fragment>
      <ModalNotification isOpen={openModal} onClick={handleOpenModal}>
        {isSuccess && (
          <span className={`${isSuccess && "text-green"}`}>
            <IconSuccess size={50}></IconSuccess>
          </span>
        )}
        {isError && (
          <span className={`${isError && "text-danger"}`}>
            <IconError size={50}></IconError>
          </span>
        )}
        <span className="text-center">
          {isSuccess && <p>Cập nhật thành công</p>}
          {isError && <p>Cập nhật thất bại</p>}
        </span>
      </ModalNotification>
      <section className="max-w-[1000px] w-full bg-white rounded px-8">
        <Heading
          title="Hồ Sơ Của Bạn"
          className="flex flex-col items-start justify-center"
        >
          <p className="mt-1 text-sm text-gray">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)} className="py-[30px]">
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
                  <span>{profile?.phone}</span>
                  <Link
                    to="/user/account/phone"
                    className="underline cursor-pointer text-blue hover:text-orange"
                  >
                    {profile?.phone ? "Thay Đổi" : "Thêm"}
                  </Link>
                </div>
              </Field>
              <Field variant="flex-row" className="gap-x-5">
                <Label className="w-[150px] text-end">Email</Label>
                <div className="flex gap-x-3">
                  <span>{profile?.email}</span>
                  <Link
                    to="/user/account/email"
                    className="underline cursor-pointer text-blue hover:text-orange"
                  >
                    {profile?.email ? "Thay Đổi" : "Thêm"}
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
            <div className="flex flex-col w-[400px] items-center gap-y-5 border-l-1 border-l-grayCa ">
              <div className="w-[100px] h-[100px] rounded-full bg-auto bg-orangeFe overflow-hidden">
                <img
                  alt=""
                  srcSet={
                    images.length > 0
                      ? images[0]["data_url"]
                      : profile?.avatar?.url || profile?.avatarDefault
                  }
                  className={"w-full h-full bg-cover "}
                />
              </div>
              <ImageUploading
                value={images}
                onChange={onChangeImage}
                maxNumber={1}
                dataURLKey="data_url"
              >
                {({ onImageUpload, onImageUpdate }) => (
                  <Button
                    type="button"
                    variant="outLine"
                    className="text-xs"
                    onClick={() => {
                      if (images) {
                        onImageUpdate(0);
                      } else {
                        onImageUpload();
                      }
                    }}
                  >
                    Chọn ảnh
                  </Button>
                )}
              </ImageUploading>
              <span className="text-xs text-gray">Định dạng:.JPEG, .PNG</span>
            </div>
          </div>
          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className={`mt-5 ml-[100px]`}
          >
            {isLoading ? (
              <LoadingSpinner className={"w-6 h-6"}></LoadingSpinner>
            ) : (
              "Lưu"
            )}
          </Button>
        </form>
      </section>
    </Fragment>
  );
}

export default FormInfoUser;
