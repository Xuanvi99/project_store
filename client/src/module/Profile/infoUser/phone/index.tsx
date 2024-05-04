import Heading from "../../common/Heading";
import { useAppSelector } from "../../../../hook";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "@/stores";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCheckPhoneOrEmailMutation } from "@/stores/service/user.service";
import { ModalNotification } from "@/components/modal";
import { IconAlert, IconError, IconSuccess } from "@/components/icon";
import { Label } from "@/components/label";
import { InputForm } from "@/components/input";
import { ErrorInput } from "@/components/error";
import { Button } from "@/components/button";
import LoadingSpinner from "@/components/loading";

function FormPhone() {
  const navigate = useNavigate();
  const { pathname, state: statePath } = useLocation();

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Vui lòng điền thông tin.")
      .test(
        "maxLengthPhone",
        "Số điện thoại dài không quá 11 ký tự",
        (value) => {
          return value.length <= 11;
        }
      )
      .matches(
        /^(84|0[3|5|7|8|9])+([0-9]{8}|[0-9]{9})\b/,
        "Số điện thoại không hợp lệ"
      )
      .test(
        "matchPhone",
        "Bạn vừa nhập số điện thoại hiện tại. Vui lòng nhập số điện thoại mới",
        (value) => {
          return value !== user?.phone;
        }
      ),
  });

  type formValue = Yup.InferType<typeof validationSchema>;

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, dirtyFields },
  } = useForm<formValue>({
    defaultValues: {
      phone: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const [checkPhoneOrEmail, { isLoading }] = useCheckPhoneOrEmailMutation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = useRef<() => void>();

  const onSubmit = async (data: formValue) => {
    try {
      const res = await checkPhoneOrEmail({
        phoneOrEmail: data.phone,
      }).unwrap();
      if (res.isCheckUser) {
        setOpenModal(true);
      } else {
        navigate(`/verify/otp?account=${data.phone}&&phoneOrEmail=phone`, {
          state: { path: pathname },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleOpenModal.current = () => {
    setOpenModal(false);
    setFocus("phone");
    reset({ phone: "" });
  };

  useEffect(() => {
    handleOpenModal.current;
  }, [handleOpenModal]);

  return (
    <section className="max-w-[1000px] w-full bg-white rounded px-8">
      <Heading className="flex flex-col items-start justify-center">
        <h1 className="text-lg font-medium">
          {user?.email ? "Chỉnh Sửa Số Điện Thoại" : "Thêm Số Điện Thoại"}
        </h1>
      </Heading>
      <div className="pt-10">
        <ModalNotification isOpen={openModal} onClick={handleOpenModal.current}>
          <div className="w-[300px] p-5 relative rounded-md overflow-hidden">
            <div className="absolute inset-0 z-50 bg-black opacity-75"></div>
            <div className="relative z-[60] flex flex-col items-center text-white gap-y-5">
              {!statePath && (
                <>
                  <span className="text-danger">
                    <IconAlert size={50}></IconAlert>
                  </span>
                  <span className="text-center">
                    <p>Số điện thoại bạn nhập đã đăng ký !</p>
                    <p>Vui lòng nhập Số điện thoại mới</p>
                  </span>
                </>
              )}
              {statePath && (
                <>
                  <span className="text-success">
                    {statePath.isUpdate ? (
                      <IconSuccess size={50}></IconSuccess>
                    ) : (
                      <IconError size={50}></IconError>
                    )}
                  </span>
                  <span className="text-center">{statePath.message}</span>
                </>
              )}
            </div>
          </div>
        </ModalNotification>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-[150px_500px] gap-x-5 gap-y-3">
            <Label htmlFor="phoneNumber" className="flex items-center">
              Số điện thoại mới:
            </Label>
            <InputForm
              control={control}
              type="text"
              name="phone"
              id="phone"
              placeholder="Nhập số..."
              error={errors["phone"] ? true : false}
              className={{
                wrap: "max-w-[500px]",
                input:
                  dirtyFields.phone && !errors["phone"]
                    ? "border-green text-green"
                    : "",
              }}
            />
            <ErrorInput
              className={`col-start-2 col-end-3 ${
                errors["phone"]?.message ? "" : "visible"
              }`}
              text={errors["phone"]?.message}
            />
            <Button
              disabled={
                errors.phone || !dirtyFields.phone || isLoading ? true : false
              }
              type="submit"
              variant="default"
              className="col-start-2 col-end-3 max-w-[100px] flex justify-center"
            >
              {isLoading ? (
                <LoadingSpinner className={"w-6 h-6"}></LoadingSpinner>
              ) : (
                "Tiếp Theo"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FormPhone;
