import { Button } from "@/components/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";
import { DetailProductContext, IDetailProductProvide } from "../../context";
import useTestContext from "@/hook/useTestContext";
import { InputForm } from "@/components/input";
import { IconDelete, IconError } from "@/components/icon";
import { cn } from "@/utils";
import { useUpdateSizeAndQuantityProductMutation } from "@/stores/service/product.service";
import { toast } from "react-toastify";
import ProductSizeAndQuantity from "../infoDetail/ProductSizeAndQuantity.info";
import { useToggle } from "@/hook";
import ModalVerify from "@/components/modal/ModalVerify";

type specs = { size: number; quantity: number };

function SizeAndQuantityDetail() {
  const { product, listProductItem, setShowTab } =
    useTestContext<IDetailProductProvide>(
      DetailProductContext as React.Context<IDetailProductProvide>
    );

  const [specs, setSpecs] = useState<specs[]>([{ size: 0, quantity: 0 }]);

  const [total, setTotal] = useState<number>(0);

  const [dataUpdate, setDataUpdate] = useState<FormValues | null>(null);

  const { toggle: isOpenModal, handleToggle: handleOpenModal } = useToggle();

  const formSchema = {
    size: Yup.number()
      .required("Điền thông tin size")
      .min(35, "Size >= 35")
      .max(44, "Size <= 44")
      .test(
        "unique",
        "Lỗi trùng lặp size",
        (value) =>
          specs.length >= 1 &&
          specs.filter((item) => Number(value) === Number(item.size)).length < 2
      ),
    quantity: Yup.number()
      .required("Điền thông tin số lượng giày")
      .min(0, "số lượng > 0"),
  };

  const validationSchema = Yup.object().shape({
    specs: Yup.array()
      .of(Yup.object().shape(formSchema))
      .required("Must have fields")
      .min(1, "ít nhất 1 loại size giày 35 -> 44")
      .max(10, "tối đa 10 loại size giày 35 -> 44"),
  });

  type FormValues = Yup.InferType<typeof validationSchema>;

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm({
    defaultValues: {
      specs: specs,
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  console.log("dirtyFields", dirtyFields);
  console.log("isDirty", isDirty);

  const { fields, remove, append } = useFieldArray({
    control,
    name: "specs",
  });

  const [updateSizeAndQuantityProduct, { isLoading: isLoadingUpdate }] =
    useUpdateSizeAndQuantityProductMutation();

  const handleBLurInput = (index: number) => {
    const { size, quantity } = watch().specs[index];

    if (!size) {
      setValue(`specs.${index}.size`, 0);
    }
    if (!quantity) {
      setValue(`specs.${index}.quantity`, 0);
    }

    if (size || quantity) {
      reset({ specs: specs }, { keepErrors: true });
    }
  };

  const handleFocusInput = (index: number, type: "size" | "quantity") => {
    if (type === "size") {
      const inputSize = document.getElementById(
        `specs.${index}.size`
      ) as HTMLInputElement;
      if (inputSize) {
        inputSize.select();
      }
    }
    if (type === "quantity") {
      const inputQuantity = document.getElementById(
        `specs.${index}.quantity`
      ) as HTMLInputElement;

      if (inputQuantity) {
        inputQuantity.select();
      }
    }
  };

  const handleChangeInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "size" | "quantity",
    index: number
  ) => {
    const data = watch().specs;
    const value = Number(event.currentTarget.value);
    if (type === "quantity" && data) {
      setValue(`specs.${index}.quantity`, Number(value));
      if (value > 0) {
        setTotal(
          data.reduce((a: number, b: { size: number; quantity: number }) => {
            return a + Number(b.quantity);
          }, 0)
        );
      }
    }
    if (type === "size") {
      setValue(`specs.${index}.size`, value);
    }
    setSpecs(watch().specs);
    await trigger();
  };

  const handleResetSpecs = useCallback(() => {
    if (listProductItem) {
      const arrSpecs = listProductItem.map((productItem) => {
        return {
          size: +productItem.size,
          quantity: productItem.quantity,
        };
      });
      setSpecs([...arrSpecs]);
      setTotal(
        arrSpecs.reduce((a: number, b: { size: number; quantity: number }) => {
          return a + Number(b.quantity);
        }, 0)
      );
      reset({ specs: arrSpecs });
    }
  }, [listProductItem, reset]);

  const handleCheckError = () => {
    const listError = errors.specs;
    if (
      Object.keys(errors).length > 0 &&
      listError &&
      listError.length &&
      listError.length > 0
    ) {
      for (let i = 0; i < listError.length; i++) {
        if (listError[i] === undefined) {
          continue;
        }
        if (listError[i] && listError[i]?.size) {
          return listError[i]?.size?.message;
        } else if (listError[i]?.quantity) {
          return listError[i]?.quantity?.message;
        } else {
          return <></>;
        }
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    setDataUpdate(data);
    handleOpenModal();
  };

  const handleCallApiUpdate = async () => {
    if (product && dataUpdate) {
      await updateSizeAndQuantityProduct({
        productId: product._id,
        specs: dataUpdate.specs,
      })
        .unwrap()
        .then(() => {
          toast("Cập nhật size - số lượng thành công", { type: "success" });
          setShowTab("info");
          window.scrollTo({ behavior: "smooth", top: 0 });
        })
        .catch(() =>
          toast("Cập nhật size - số lượng thất bại", { type: "error" })
        )
        .finally(() => {
          handleOpenModal();
          setDataUpdate(null);
        });
    }
  };

  useEffect(() => {
    const data = watch().specs;
    if (data) {
      setTotal(
        data.reduce((a: number, b: { size: number; quantity: number }) => {
          return a + Number(b.quantity);
        }, 0)
      );
    }
  }, [watch]);

  useEffect(() => {
    handleResetSpecs();
  }, [handleResetSpecs]);

  return (
    <div className="flex flex-col w-full rounded-md shadow-md shadow-gray">
      <ModalVerify
        isOpenModal={isOpenModal}
        handleOpenModal={handleOpenModal}
        handleConfirm={handleCallApiUpdate}
        isLoading={isLoadingUpdate}
      >
        <p className="mt-3 text-sm">
          Bạn có chắc chắn muốn cập nhật
          <strong className="text-danger ml-1">size - số lượng</strong> sản phẩm
          ?
        </p>
      </ModalVerify>
      <div className="w-full p-5 bg-white shadow-shadow1">
        <h1 className="text-lg font-semibold text-orange">3.Size - Số lượng</h1>
        <div className="flex">
          <ProductSizeAndQuantity></ProductSizeAndQuantity>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">
            <div className="flex flex-col mx-auto justify-center p-5 gap-y-5 border-1 rounded-md border-grayCa shadow-shadow1 max-w-[520px]">
              <h1 className="text-xl font-semibold text-center">
                Bảng Cập nhật
              </h1>
              <table
                className={cn(
                  "w-full text-center",
                  "[&>tbody>tr>td]:py-2 [&>tbody>tr>td]:text-center [&>tbody>tr>td]:border-b-1 [&>tbody>tr>td]:border-b-grayCa",
                  "[&>tbody>tr>th]:text-center [&>tbody>tr>th]:py-2"
                )}
              >
                <tbody>
                  <tr className="text-base font-semibold bg-slate-100">
                    <th>Stt</th>
                    <th>Size</th>
                    <th>Số lượng</th>
                    <th>Công cụ</th>
                  </tr>
                  {fields.map((field, index) => {
                    return (
                      <tr key={field.id}>
                        <td>{index + 1}</td>
                        <td>
                          <InputForm
                            control={control}
                            type="number"
                            name={`specs.${index}.size` as const}
                            id={`specs.${index}.size` as const}
                            min={35}
                            max={44}
                            value={watch().specs[index].size}
                            onBlur={() => handleBLurInput(index)}
                            onFocus={() => handleFocusInput(index, "size")}
                            onChange={(event) =>
                              handleChangeInput(event, "size", index)
                            }
                            className={{
                              input: `w-[50px] text-base text-center font-medium border-transparent border-b-2 border-b-gray rounded-none ${
                                errors &&
                                errors.specs &&
                                errors.specs.length &&
                                errors.specs.length > 0 &&
                                errors.specs[index]?.size &&
                                "border-b-danger text-danger"
                              }`,
                            }}
                          />
                        </td>
                        <td>
                          <InputForm
                            control={control}
                            type="number"
                            name={`specs.${index}.quantity` as const}
                            id={`specs.${index}.quantity` as const}
                            min={0}
                            onBlur={() => handleBLurInput(index)}
                            onFocus={() => handleFocusInput(index, "quantity")}
                            onChange={(event) =>
                              handleChangeInput(event, "quantity", index)
                            }
                            className={{
                              input: `w-[150px] text-base text-center border-transparent border-b-2 border-b-gray rounded-none transition-all ${
                                errors &&
                                errors.specs &&
                                errors.specs.length &&
                                errors.specs.length > 0 &&
                                errors.specs[index]?.quantity &&
                                "border-b-danger text-danger"
                              }`,
                            }}
                          />
                        </td>
                        <td>
                          <span
                            className="flex items-center justify-center"
                            onClick={() => {
                              remove(index);
                              setSpecs(watch().specs);
                            }}
                          >
                            <IconDelete size={20}></IconDelete>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {Object.keys(errors).length > 0 && (
                <span className="flex ml-2 text-xs italic text-danger gap-x-2">
                  <IconError size={15}></IconError>
                  {handleCheckError()}
                </span>
              )}
              <div className={`flex items-center justify-between`}>
                <Button
                  type="button"
                  variant="outLine-flex"
                  className="inline px-2 text-xs"
                  onClick={() => {
                    append({
                      size: 0,
                      quantity: 0,
                    });
                    setSpecs(watch().specs);
                  }}
                >
                  + Thêm Size-Số lượng
                </Button>
                <Button
                  type="button"
                  variant="outLine-flex"
                  className="inline px-2 text-xs"
                  onClick={handleResetSpecs}
                >
                  Khôi phục mặc định
                </Button>
              </div>
              {fields.length > 0 && (
                <div className="w-[500px] flex gap-x-5 text-sm font-semibold">
                  <span>Tổng số lượng:</span>
                  <span>{total}</span>
                </div>
              )}
              <div className="flex items-start justify-start w-full text-sm gap-x-5 text-gray">
                <span className="font-semibold text-gray">Chú ý:</span>
                <ul className="flex flex-col text-xs gap-y-1">
                  <li> - Size giày giới hạn từ 35 {"=>"} 44</li>
                  <li> - Không được nhập trùng lặp size </li>
                  <li> - Giá trị nhập phải {">="}0 </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <Button type="submit" variant="default">
                Cập nhật
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SizeAndQuantityDetail;
