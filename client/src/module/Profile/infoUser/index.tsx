import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Field from "../../../components/fields";
import { Label } from "../../../components/label";
import { InputForm } from "../../../components/input";
import { ErrorInput } from "../../../components/error";
import InputRadio from "../../../components/input/InputRadio";
import { Button } from "../../../components/button";
import Heading from "../common/Heading";

const validatingSchema = Yup.object({
  userName: Yup.string()
    .required("Vui lòng điền tên tài khoản")
    .min(6, "Độ dài ít nhất 8 ký tự"),
  email: Yup.string().required(),
  phone: Yup.string().required(),
  gender: Yup.string().required().oneOf(["male", "female", "other"]),
  date: Yup.string().required("Vui lòng chọn ngày sinh"),
});

type formValues = Yup.InferType<typeof validatingSchema>;

function FormInfoUser() {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isDirty },
  } = useForm<formValues>({
    defaultValues: {
      userName: "bui xuan vi",
      email: "traigiaotu123@gmail.com",
      phone: "0377825679",
      gender: "male",
      date: "2023-03-21",
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

  const onSubmit = (data: formValues) => console.log(data);

  const [images, setImages] = useState([]);

  const onChangeImage = (imageList: ImageListType) => {
    setImages(imageList as never[]);
  };

  return (
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
            <Field variant="flex-row" className="gap-x-5">
              <Label className="min-w-[150px] text-end">Tên tài khoản</Label>
              <div className="flex flex-col gap-y-1">
                <InputForm
                  control={control}
                  name="userName"
                  className={{ input: "py-1 text-sm max-w-[500px]" }}
                ></InputForm>
                <ErrorInput text={errors.userName?.message}></ErrorInput>
              </div>
            </Field>
            <Field variant="flex-row" className="gap-x-5">
              <Label className="w-[150px] text-end">Email</Label>
              <div>
                <span>traigiaotu123@gmail.com</span>
              </div>
            </Field>
            <Field variant="flex-row" className="gap-x-5">
              <Label className="w-[150px] text-end">Số điện thoại</Label>
              <div>
                <span>0377825679</span>
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
            <div className="w-[100px] h-[100px] rounded-full bg-orangeFe overflow-hidden">
              <img
                alt=""
                srcSet={images[0] ? images[0]["data_url"] : "/userName.png"}
                className={"w-full h-full bg-cover"}
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
          className="mt-5 ml-[100px]"
          disabled={isDirty && Object.keys(errors).length === 0 ? false : true}
        >
          Lưu
        </Button>
      </form>
    </section>
  );
}

export default FormInfoUser;
