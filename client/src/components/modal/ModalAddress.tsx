import { useForm } from "react-hook-form";
import Modal from ".";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Field from "../fields/index";
import { Label } from "../label";
import InputForm from "../input/InputForm";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Button } from "../button";
import { DropdownForm } from "../dropdown";
import ErrorInput from "../error/ErrorInput";
import IconCLose from "../icon/IconCLose";

import {
  useAddAddressMutation,
  useGetAddressQuery,
  useUpDateAddressMutation,
} from "../../stores/service/address.service";
import LoadingSpinner from "../loading";
import { useAppSelector } from "../../hook";
import { IAddress } from "@/types/address.type";
import { RootState } from "@/stores";
import { IUser } from "@/types/user.type";
import {
  useLazyGetProvinceQuery,
  usePostDistrictMutation,
  usePostWardMutation,
} from "@/stores/service/transport.service";

const validatingSchema = Yup.object({
  name: Yup.string()
    .required("Vui lòng điền tên của bạn")
    .matches(
      /^([a|A-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+)((\s{1}[a|A-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+){1,})$/,
      "Họ và tên không hợp lệ"
    ),
  phone: Yup.string()
    .required("Vui lòng điền Số điện thoại")
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
  province: Yup.string().required("Invalid!"),
  provinceId: Yup.number().required("Invalid!"),
  district: Yup.string().required("Invalid!"),
  districtId: Yup.number().required("Invalid!"),
  ward: Yup.string().required("Invalid!"),
  wardCode: Yup.string().required("Invalid!"),
  specific: Yup.string().required(
    "Vui lòng điền thêm thông tin địa chỉ cụ thể"
  ),
});

type formValues = Yup.InferType<typeof validatingSchema>;

type optionValue = { label: string; value: string; id: number | string };

function ModalAddress({
  show,
  handleShow,
  checkAddress = true,
}: {
  show: boolean;
  handleShow: () => void;
  checkAddress?: boolean;
}) {
  const user: IUser | null = useAppSelector(
    (state: RootState) => state.authSlice.user
  );

  const [listProvince, setListProvince] = useState<optionValue[]>([]);
  const [listDistrict, setListDistrict] = useState<optionValue[]>([]);
  const [listWard, setListWard] = useState<optionValue[]>([]);
  const [address, setAddress] = useState<IAddress>();

  const id = user ? user._id : "";
  const { data, status } = useGetAddressQuery(id, { skip: !id });
  const [addAddress, { isLoading: loadingAdd }] = useAddAddressMutation();
  const [upDateAddress, { isLoading: loadingUpdate }] =
    useUpDateAddressMutation();

  const [getProvince] = useLazyGetProvinceQuery();
  const [postDistrict] = usePostDistrictMutation();
  const [postWard] = usePostWardMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<formValues>({
    defaultValues: {
      name: "",
      phone: "",
      province: "",
      provinceId: 0,
      district: "",
      districtId: 0,
      ward: "",
      wardCode: "",
      specific: "",
    },
    resolver: yupResolver(validatingSchema),
    mode: "onChange",
  });

  const handleFetchDataAddress = useCallback(
    async ({
      params,
      id,
    }: {
      params: "province" | "district" | "ward";
      id: number;
    }) => {
      switch (params) {
        case "province": {
          await getProvince()
            .unwrap()
            .then((res) => {
              const data = res.data;
              const results: optionValue[] = [];
              if (data) {
                data.forEach(
                  (item: { ProvinceName: string; ProvinceID: number }) => {
                    results.push({
                      label: item.ProvinceName,
                      value: item.ProvinceName,
                      id: item.ProvinceID,
                    });
                  }
                );
              }
              setListProvince(results);
            });
          break;
        }

        case "district": {
          await postDistrict({
            province_id: id,
          })
            .unwrap()
            .then((res) => {
              const data = res.data;
              const results: optionValue[] = [];
              if (data) {
                data.forEach(
                  (item: { DistrictName: string; DistrictID: number }) => {
                    results.push({
                      label: item.DistrictName,
                      value: item.DistrictName,
                      id: item.DistrictID,
                    });
                  }
                );
              }
              setListDistrict(results);
            });
          break;
        }

        case "ward": {
          await postWard({
            district_id: id,
          })
            .unwrap()
            .then((res) => {
              const data = res.data;
              const results: optionValue[] = [];
              data && data.length > 0
                ? data.forEach(
                    (item: { WardName: string; WardCode: string }) => {
                      results.push({
                        label: item.WardName,
                        value: item.WardName,
                        id: item.WardCode,
                      });
                    }
                  )
                : results.push({
                    label: "Không có Phường xã",
                    value: "",
                    id: "0",
                  });
              setListWard(results);
            });
          break;
        }
        default:
          break;
      }
    },
    [getProvince, postDistrict, postWard]
  );

  const handleResetData = useCallback(() => {
    if (address) {
      reset({
        name: address.name,
        phone: address.phone,
        province: address.province,
        provinceId: address.provinceId,
        district: address.district,
        districtId: address.districtId,
        ward: address.ward ? address.ward : "",
        wardCode: address.wardCode ? address.wardCode : "",
        specific: address.specific,
      });
    } else {
      reset({
        name: "",
        phone: "",
        province: "",
        provinceId: 0,
        district: "",
        districtId: 0,
        ward: "",
        wardCode: "",
        specific: "",
      });
    }
  }, [address, reset]);

  const checkDisabledSubmit = (): boolean => {
    if (address) {
      return isDirty ||
        watch("province") !== address.province ||
        watch("district") !== address.district ||
        watch("ward") !== address.ward
        ? false
        : true;
    }
    return false;
  };

  useLayoutEffect(() => {
    if (data && status === "fulfilled") {
      setAddress(data.address);
    }
  }, [data, status]);

  useEffect(() => {
    handleResetData();
  }, [handleResetData]);

  useEffect(() => {
    handleFetchDataAddress({ params: "province", id: 0 });
    if (address) {
      handleFetchDataAddress({ params: "district", id: +address.provinceId });
      handleFetchDataAddress({ params: "ward", id: +address.districtId });
    }
  }, [address, handleFetchDataAddress]);

  const Onsubmit = async (data: formValues) => {
    address
      ? await upDateAddress({ id: address.userId, body: data }).unwrap()
      : await addAddress({ body: { ...data, userId: id } }).unwrap();
    if (!loadingUpdate || !loadingAdd) {
      handleResetData();
      handleShow();
    }
  };

  return (
    <Modal
      isOpenModal={show}
      onClick={() => {
        if (checkAddress) {
          handleResetData();
          handleShow();
        }
      }}
      className={{
        content:
          "modal-content max-w-[600px] w-full p-[30px] relative bg-white rounded z-[70]",
      }}
    >
      {checkAddress && (
        <div
          onClick={handleShow}
          className="absolute cursor-pointer top-2 right-2 hover:text-red-600"
        >
          <IconCLose size={25}></IconCLose>
        </div>
      )}
      {checkAddress ? (
        <h1 className="text-2xl mb-[15px]">Cập nhật địa chỉ</h1>
      ) : (
        <>
          <h1 className="text-2xl">Địa chỉ mới</h1>
          <p className="my-2 text-xs">
            Để đặt hàng, vui lòng thêm địa chỉ nhận hàng
          </p>
        </>
      )}
      <form
        onSubmit={handleSubmit(Onsubmit)}
        className="flex flex-col mt-5 gap-y-7"
      >
        <div className="flex w-full gap-x-2">
          <Field variant="flex-col" className="w-1/2">
            <Label name="name">Họ và tên:</Label>
            <InputForm
              control={control}
              type="text"
              name="name"
              id="name"
              error={errors.name?.message ? true : false}
              placeholder="Nguyễn Văn A"
              className={{ input: "py-1" }}
            ></InputForm>
            <ErrorInput text={errors.name?.message}></ErrorInput>
          </Field>
          <Field variant="flex-col" className="w-1/2">
            <Label name="phone">Số điện thoại:</Label>
            <InputForm
              control={control}
              type="number"
              name="phone"
              id="phone"
              error={errors.phone?.message ? true : false}
              placeholder="03********"
              className={{
                input: `py-1 `,
              }}
            ></InputForm>
            <ErrorInput text={errors.phone?.message}></ErrorInput>
          </Field>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="grid grid-cols-3 gap-x-2">
            <Field variant="flex-col">
              <Label>Tỉnh/Thành phố:</Label>
              <DropdownForm
                control={control}
                name="province"
                title={address ? address.province : "Chọn Tỉnh/Thành phố"}
                options={listProvince}
                error={errors.district && !watch("province")}
                search={{
                  display: listProvince.length > 0 ? true : false,
                  place: "top",
                }}
                className={{
                  option: "max-h-[160px] overflow-y-scroll  rounded-none",
                }}
                onClick={(option) => {
                  setValue("province", option.value);
                  setValue("provinceId", +option.id);
                  setValue("district", "");
                  setValue("ward", "");
                  handleFetchDataAddress({
                    params: "district",
                    id: +option.id,
                  });
                }}
              />
            </Field>
            <Field variant="flex-col">
              <Label>Quận/Huyện:</Label>
              <DropdownForm
                control={control}
                name="district"
                disable={watch("province") ? false : true}
                title={
                  watch("district") === ""
                    ? "Chọn Quận/Huyện"
                    : (address?.district as string)
                }
                options={listDistrict}
                error={errors.district && !watch("district")}
                search={{
                  display: listDistrict.length > 0 ? true : false,
                  place: "top",
                }}
                className={{
                  select: watch("province")
                    ? "line-clamp-1 whitespace-nowrap"
                    : "shadow-inner text-gray",
                  option: "max-h-[160px] overflow-y-scroll rounded-none",
                }}
                onClick={(option) => {
                  setValue("district", option.value);
                  setValue("districtId", +option.id);
                  setValue("ward", "");
                  handleFetchDataAddress({ params: "ward", id: +option.id });
                }}
              />
            </Field>
            <Field variant="flex-col">
              <Label>Phường/Xã:</Label>
              <DropdownForm
                control={control}
                name="ward"
                title={
                  watch("ward") === ""
                    ? "Chọn Phường/Xã"
                    : address && address.ward
                    ? address.ward
                    : "không có Phường/Xã"
                }
                disable={watch("district") ? false : true}
                options={listWard}
                error={errors.ward && !watch("ward")}
                search={{
                  display: listWard.length > 0 ? true : false,
                  place: "top",
                }}
                className={{
                  select: `${
                    watch("district")
                      ? "line-clamp-1 whitespace-nowrap"
                      : "shadow-inner text-gray"
                  } `,
                  option: "max-h-[160px] overflow-y-scroll rounded-none",
                }}
                onClick={(option) => {
                  setValue("ward", option.value ? option.value : "Không");
                  setValue("wardCode", "" + option.id);
                }}
              />
            </Field>
          </div>
          <ErrorInput
            text={
              errors.province && !watch("province")
                ? "Vui lòng chọn Tỉnh/Thành phố, Quận/Huyện và Phường/Xã"
                : errors.district && !watch("district")
                ? "Vui lòng chọn Quận/Huyện và Phường/Xã"
                : errors.ward && !watch("ward")
                ? "Vui lòng chọn Phường/Xã"
                : ""
            }
          />
        </div>
        <Field variant="flex-col">
          <Label name="specific">
            Đại chỉ cụ thể <strong className="text-danger">*</strong>:
          </Label>
          <InputForm
            control={control}
            name="specific"
            id="specific"
            value={watch("specific")}
            error={errors.specific?.message ? true : false}
            placeholder="Ví dụ: số nhà,ngõ,xóm..."
            className={{
              input: `py-1 `,
            }}
          />
          <ErrorInput text={errors.specific?.message} />
        </Field>
        <div className="flex justify-end ">
          <Button
            variant="default"
            type="submit"
            disabled={checkDisabledSubmit()}
            className="min-w-[130px] flex justify-center"
          >
            {loadingUpdate || loadingAdd ? (
              <LoadingSpinner></LoadingSpinner>
            ) : (
              "Cập nhật"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalAddress;
