import Heading from "../../common/Heading";
import { useAppSelector } from "../../../../hook";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useCheckUserMutation } from "../../../../stores/service/user.service";
import { useEffect, useState } from "react";
import { Label } from "../../../../components/label";
import { InputForm } from "../../../../components/input";
import { ErrorInput } from "../../../../components/error";
import { Button } from "../../../../components/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { ModalNotification } from "../../../../components/modal";

function FormPhone() {
  const user = useAppSelector((state) => state.authSlice.user);

  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("Vui lòng điền vào mục này.")
      .matches(/^(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ")
      .test(
        "match",
        "Bạn vừa nhập số điện thoại hiện tại. Vui lòng nhập số điện thoại mới",
        (value) => {
          return value === user?.phone;
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

  const [checkUser, { isLoading }] = useCheckUserMutation();
  const [isCheckPhone, setIsCheckPhone] = useState<boolean>(true);
  const [account, setAccount] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const onSubmit = async (data: formValue) => {
    try {
      const res = await checkUser({ phoneOrEmail: data.phone }).unwrap();
      if (!res.isCheckUser) {
        setAccount(data.phone);
        setIsCheckPhone(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(false);
    setFocus("phone");
    reset({ phone: "" });
  };

  useEffect(() => {
    reset({ phone: "" });
    setFocus("phone");
  }, [reset, setFocus]);

  return (
    <section className="max-w-[1000px] w-full bg-white rounded px-8">
      <Heading
        title={user?.email ? "Chỉnh Sửa Số Điện Thoại" : "Thêm Số Điện Thoại"}
        className="flex flex-col items-start justify-center"
      />
      <div className="pt-10">
        <ModalNotification isOpen={openModal} onClick={handleOpenModal}>
          <span className="text-center">
            <p>Số điện thoại bạn nhập đã đăng ký !</p>
            <p>Vui lòng nhập số điện thoại mới</p>
          </span>
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
              disabled={errors.phone || !dirtyFields.phone ? true : false}
              type="submit"
              variant="default"
              className="col-start-2 col-end-3 max-w-[150px]"
            >
              Đăng nhập
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FormPhone;
