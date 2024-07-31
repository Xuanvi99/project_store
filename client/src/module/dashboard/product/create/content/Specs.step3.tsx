import { Fragment, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputForm } from "@/components/input";
import { IconChevronLeft, IconDelete } from "@/components/icon";
import { Button } from "@/components/button";
import useTestContext from "@/hook/useTestContext";
import Modal from "@/components/modal";
import LoadingSpinner from "@/components/loading";
import { CreatePdContext, ICreatePdProvide } from "../context";

function Specs() {
  const {
    specs,
    modifyTable,
    isLoading,
    handleModifyTable,
    handleActiveStep,
    handleSetData,
    handleSaveStep3,
    handleSubmitProduct,
  } = useTestContext<ICreatePdProvide>(
    CreatePdContext as React.Context<ICreatePdProvide>
  );

  const [watchData, setWatchData] = useState<
    { size: number; quantity: number }[]
  >([]);

  const [total, setTotal] = useState<number>(0);

  const formSchema = {
    size: Yup.number()
      .required("Điền thông tin size")
      .min(35, "Size > 35")
      .max(44, "Size < 44")
      .test("unique", "Only unique size allowed.", (value) => {
        if (watchData.length > 1) {
          return (
            watchData.filter((item) => Number(value) === Number(item.size))
              .length < 2
          );
        } else {
          return (
            specs.filter((item) => Number(value) === Number(item.size)).length <
            2
          );
        }
      }),
    quantity: Yup.number()
      .required("Điền thông tin số lượng")
      .min(0, "Quantity > 0"),
  };

  const validationSchema = Yup.object().shape({
    data: Yup.array()
      .of(Yup.object().shape(formSchema))
      .required("Must have fields")
      .min(1, "Minimum of 1 field")
      .max(10, "Maximum of 10 field"),
  });

  type FormValues = Yup.InferType<typeof validationSchema>;

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      data: specs,
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "data",
  });

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleBLurInput = (index: number) => {
    const { size, quantity } = watch().data[index];
    if (!size) {
      setValue(`data.${index}.size`, 0);
    }
    if (!quantity) {
      setValue(`data.${index}.quantity`, 0);
      clearErrors(`data.${index}.quantity`);
    }
  };

  const handleFocusInput = (index: number, type: "size" | "quantity") => {
    if (type === "size") {
      const inputSize = document.getElementById(
        `data.${index}.size`
      ) as HTMLInputElement;
      if (inputSize) {
        inputSize.select();
      }
    }
    if (type === "quantity") {
      const inputQuantity = document.getElementById(
        `data.${index}.quantity`
      ) as HTMLInputElement;

      if (inputQuantity) {
        inputQuantity.select();
      }
    }
  };

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "size" | "quantity"
  ) => {
    const data = watch().data;
    const value = event.currentTarget.value;
    if (type === "quantity" && data) {
      if (Number(value) > 0) {
        setTotal(
          data.reduce((a: number, b: { size: number; quantity: number }) => {
            return a + Number(b.quantity);
          }, 0)
        );
      }
    }
    if (type === "size") {
      setWatchData(watch().data);
    }
    handleSaveStep3(watch().data);
    trigger();
  };

  const handleOpenModal = () => {
    if (!isLoading) {
      setOpenModal(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (modifyTable) {
      handleModifyTable(false);
    } else {
      handleSaveStep3(data["data"]);
      const dataSort = data["data"].sort((a, b) => a.size - b.size);
      handleSetData({ specs: JSON.stringify(dataSort) });
      handleModifyTable(true);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (fields) {
      trigger();
    }
  }, [fields, trigger]);

  useEffect(() => {
    const data = watch().data;
    if (data) {
      setTotal(
        data.reduce((a: number, b: { size: number; quantity: number }) => {
          return a + Number(b.quantity);
        }, 0)
      );
    }
  }, [watch]);

  useEffect(() => {
    if (!isLoading) {
      setOpenModal(false);
    }
  }, [isLoading]);

  return (
    <Fragment>
      <Modal
        isOpenModal={openModal}
        onClick={handleOpenModal}
        className={{
          overlay: "opacity-50 bg-white a",
          content:
            "bg-black w-[350px] h-[200px] rounded-md opacity-75 flex justify-center items-center gap-x-5 text-white font-semibold",
        }}
      >
        <LoadingSpinner className="w-10 h-10 border-4"></LoadingSpinner>
        <span>Đang tạo sản phẩm...</span>
      </Modal>
      <div className="mt-7">
        <div className="flex flex-col items-start gap-y-2">
          <h1 className="font-semibold">Thông số sản phẩm</h1>
          <p className="text-sm text-gray98">Điền đầy đủ thông tin bên dưới</p>
        </div>
        <div className="flex justify-center mt-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-5 gap-y-5 border-1 border-grayCa"
          >
            <h1 className="text-xl font-semibold text-center">
              Bảng Size - Số lượng
            </h1>
            <table className="w-[500px] table_Ss text-center">
              <tbody>
                <tr className="text-base font-semibold">
                  <th>Stt</th>
                  <th>Size</th>
                  <th>Số lượng</th>
                  {!modifyTable && <th>Công cụ</th>}
                </tr>
              </tbody>
              {fields.map((field, index) => {
                return (
                  <tbody key={field.id}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <InputForm
                          control={control}
                          type="number"
                          name={`data.${index}.size` as const}
                          id={`data.${index}.size` as const}
                          min={35}
                          max={44}
                          disabled={modifyTable}
                          onBlur={() => handleBLurInput(index)}
                          onFocus={() => handleFocusInput(index, "size")}
                          onChange={(event) => handleChangeInput(event, "size")}
                          className={{
                            input: `w-[50px] text-base text-center font-medium border-transparent border-b-2 border-b-gray rounded-none ${
                              errors &&
                              errors.data &&
                              errors.data.length &&
                              errors.data.length > 0 &&
                              errors.data[index]?.size &&
                              "border-b-danger text-danger"
                            }  ${modifyTable && "border-none bg-white"}`,
                          }}
                        />
                      </td>
                      <td>
                        <InputForm
                          control={control}
                          type="number"
                          name={`data.${index}.quantity` as const}
                          id={`data.${index}.quantity` as const}
                          min={0}
                          disabled={modifyTable}
                          onBlur={() => handleBLurInput(index)}
                          onFocus={() => handleFocusInput(index, "quantity")}
                          onChange={(event) =>
                            handleChangeInput(event, "quantity")
                          }
                          className={{
                            input: `w-[150px] text-base text-center border-transparent border-b-2 border-b-gray rounded-none transition-all ${
                              errors &&
                              errors.data &&
                              errors.data.length &&
                              errors.data.length > 0 &&
                              errors.data[index]?.quantity &&
                              "border-b-danger text-danger"
                            } ${modifyTable && "border-none bg-white"}`,
                          }}
                        />
                      </td>
                      {!modifyTable && (
                        <td className="leading-[30px] flex justify-center">
                          <span
                            className="py-2 mb-[3.5px]"
                            onClick={() => {
                              remove(index);
                              setWatchData(watch().data);
                              handleSaveStep3(watch().data);
                            }}
                          >
                            <IconDelete size={20}></IconDelete>
                          </span>
                        </td>
                      )}
                    </tr>
                  </tbody>
                );
              })}
            </table>
            {fields.length > 0 && (
              <div className="w-[500px] flex gap-x-5 text-sm font-semibold">
                <span>Tổng số lượng:</span>
                <span>{total}</span>
              </div>
            )}
            <div
              className={`flex items-center  ${
                !modifyTable ? "justify-between" : "justify-center"
              }`}
            >
              {!modifyTable && (
                <Button
                  variant="outLine-border"
                  className="inline p-2 text-xs"
                  onClick={() => {
                    append({
                      size: 0,
                      quantity: 0,
                    });
                    setWatchData(watch().data);
                    handleSaveStep3(watch().data);
                  }}
                >
                  +Thêm Size-Số lượng
                </Button>
              )}
              {fields.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    variant="default"
                    type="submit"
                    className="max-w-[120px] flex items-center text-xs"
                    disabled={Object.keys(errors).length === 0 ? false : true}
                  >
                    {!modifyTable ? "Lưu" : "Thay đổi"}
                  </Button>
                </div>
              )}
            </div>
            {!modifyTable && fields.length > 0 && (
              <div className="w-[500px] flex justify-start text-sm gap-x-5 items-start text-gray">
                <span className="font-semibold text-gray">Chú ý:</span>
                <ul className="flex flex-col text-xs gap-y-1">
                  <li> - Size giày giới hạn từ 35 {"=>"} 44</li>
                  <li> - Không được nhập trùng lặp size </li>
                  <li> - Giá trị nhập phải {">="}0 </li>
                </ul>
              </div>
            )}
          </form>
        </div>
        <div className="flex justify-end w-full mt-10 gap-x-3">
          <Button
            variant="default"
            onClick={() => handleActiveStep("2")}
            disabled={isLoading}
            className="max-w-[120px] flex items-center text-sm"
          >
            <IconChevronLeft size={20}></IconChevronLeft>
            <span>Quay lại</span>
          </Button>
          <Button
            variant="default"
            disabled={!modifyTable || isLoading ? true : false}
            onClick={() => {
              setOpenModal(true);
              handleSubmitProduct();
            }}
            className="max-w-[150px] flex items-center text-sm"
          >
            <span>Tạo sản phẩm</span>
          </Button>
        </div>
      </div>
    </Fragment>
  );
}

export default Specs;
