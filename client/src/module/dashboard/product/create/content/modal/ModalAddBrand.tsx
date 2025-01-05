import { Button } from "@/components/button";
import { InputCheckbox, InputForm } from "@/components/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import Modal from "@/components/modal";
import { useCreateBrandCategoryMutation } from "@/stores/service/category.service";
import { useState } from "react";
import Field from "@/components/fields";
import { ErrorInput } from "@/components/error";
import EditImage from "./EditImage";
import { toast } from "react-toastify";
import { LoadingCallApi } from "../../../../../../components/loading/index";
import { IconCLose } from "@/components/icon";

const validationSchema = Yup.object().shape({
  brand: Yup.string().required("Vui lòng điền vào mục này."),
  checkFile: Yup.boolean()
    .test("check", "Chưa có ảnh thương hiệu", (value) => {
      return value;
    })
    .oneOf([true, false]),
});
type FormValues = Yup.InferType<typeof validationSchema>;
function ModalAddBrand({
  openModal,
  handleOpenModal,
}: {
  openModal: boolean;
  handleOpenModal: () => void;
}) {
  const [createBrandCategory, { isLoading }] = useCreateBrandCategoryMutation();
  const [avatar, setAvatar] = useState<File | null>(null);

  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      brand: "",
      checkFile: false,
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    if (avatar && data.checkFile) {
      const formData = new FormData();
      formData.append("name", data.brand);
      formData.append("image", avatar);

      await createBrandCategory(formData)
        .unwrap()
        .then(() => {
          toast("Thêm thương hiệu thành công", { type: "success" });
        })
        .catch(() => {
          toast("Đã xảy ra lõi!", { type: "error" });
        })
        .finally(() => {
          reset({ brand: "", checkFile: false });
          setAvatar(null);
          handleOpenModal();
        });
    }
  };

  const handleCheckImage = (file: File | null, checkFile: boolean) => {
    setAvatar(file);
    setValue("checkFile", checkFile);
    clearErrors("checkFile");
  };

  if (isLoading) {
    return (
      <Modal
        variant="fixed"
        isOpenModal={openModal}
        className={{
          overlay: "opacity-30",
          content:
            "bg-white min-w-[300px] min-h-[150px] rounded-md shadow-lg p-5 flex gap-x-2 justify-center items-center",
        }}
      >
        <span>Đang xử lý ... </span>
        <span>
          <LoadingCallApi size={10}></LoadingCallApi>
        </span>
      </Modal>
    );
  }

  return (
    <Modal
      variant="fixed"
      isOpenModal={openModal}
      className={{
        overlay: "opacity-30",
        content:
          "bg-white min-w-[500px] min-h-[300px] rounded-md shadow-lg p-5 flex flex-col gap-y-3 relative",
      }}
    >
      <div
        onClick={() => {
          handleOpenModal();
          reset({ brand: "", checkFile: false });
        }}
        className="absolute cursor-pointer top-2 right-4"
      >
        <IconCLose size={20}></IconCLose>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-semibold text-orange">
          + Thêm Thương hiệu
        </h2>
        <div className="flex flex-col mt-5 gap-y-5">
          <Field variant="flex-col" className="basis-1/2 gap-y-2">
            <InputForm
              control={control}
              type="text"
              name="brand"
              id="brand"
              placeholder="Tên thương hiệu"
              error={errors["brand"] ? true : false}
            />
            <ErrorInput text={errors["brand"]?.message} />
          </Field>
          <InputCheckbox
            control={control}
            name="checkFile"
            id="checkFile"
            checked={watch("checkFile")}
            className={"hidden"}
          />
          <EditImage handleCheckImage={handleCheckImage} />
          <ErrorInput text={errors["checkFile"]?.message} />
          <div className="flex items-center justify-end gap-x-3">
            <Button type="submit" variant="outLine" className="px-5 text-xs">
              Thêm
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ModalAddBrand;
