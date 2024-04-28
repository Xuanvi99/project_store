import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "@/stores";
import { useAppSelector } from "@/hook";
import { useCheckPhoneOrEmailMutation } from "@/stores/service/user.service";
import Heading from "../../common/Heading";
import { ModalNotification } from "@/components/modal";
import { IconAlert, IconError, IconSuccess } from "@/components/icon";
import { Label } from "@/components/label";
import { InputForm } from "@/components/input";
import { ErrorInput } from "@/components/error";
import { Button } from "@/components/button";
import LoadingSpinner from "@/components/loading";

function FormEmail() {
  const navigate = useNavigate();
  const { pathname, state: statePath } = useLocation();
  console.log(useLocation());
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Vui lòng điền thông tin.")
      .matches(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@gmail.com\b/,
        "Email không hợp lệ"
      )
      .test(
        "matchEmail",
        "Bạn vừa nhập email hiện tại. Vui lòng nhập email mới",
        (value) => {
          return value !== user?.email;
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
      email: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const [checkPhoneOrEmail, { isLoading }] = useCheckPhoneOrEmailMutation();
  const [openModal, setOpenModal] = useState<boolean>(statePath ? true : false);
  const handleOpenModal = useRef<() => void>();

  const onSubmit = async (data: formValue) => {
    try {
      const res = await checkPhoneOrEmail({
        phoneOrEmail: data.email,
      }).unwrap();
      if (res.isCheckUser) {
        setOpenModal(true);
      } else {
        navigate(`/verify/otp?account=${data.email}&&phoneOrEmail=email`, {
          state: { path: pathname },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleOpenModal.current = () => {
    setOpenModal(false);
    setFocus("email");
    reset({ email: "" });
  };

  useEffect(() => {
    handleOpenModal.current;
  }, [handleOpenModal]);

  return (
    <section className="max-w-[1000px] w-full bg-white rounded px-8">
      <Heading className="flex flex-col items-start justify-center">
        <h1 className="text-lg font-medium">
          {user?.email ? "Thay Đổi Email" : "Thêm Email Mới"}
        </h1>
      </Heading>
      <div className="pt-10">
        <ModalNotification isOpen={openModal} onClick={handleOpenModal.current}>
          {!statePath && (
            <>
              <span className="text-danger">
                <IconAlert size={50}></IconAlert>
              </span>
              <span className="text-center">
                <p>Email bạn nhập đã đăng ký !</p>
                <p>Vui lòng nhập Email mới</p>
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
        </ModalNotification>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-[150px_500px] gap-x-5 gap-y-3">
            <Label htmlFor="phoneNumber" className="flex items-center">
              Email mới:
            </Label>
            <InputForm
              control={control}
              type="text"
              name="email"
              id="email"
              placeholder="Nhập email..."
              error={errors["email"] ? true : false}
              className={{
                wrap: "max-w-[500px]",
                input:
                  dirtyFields.email && !errors["email"]
                    ? "border-green text-green"
                    : "",
              }}
            />
            <ErrorInput
              className={`col-start-2 col-end-3 ${
                errors["email"]?.message ? "" : "visible"
              }`}
              text={errors["email"]?.message}
            />
            <Button
              disabled={
                errors.email || !dirtyFields.email || isLoading ? true : false
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

export default FormEmail;
