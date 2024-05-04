import { useForm } from "react-hook-form";
import Modal from ".";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Field from "../fields/index";
import { Label } from "../label";
import InputForm from "../input/InputForm";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "../button";
import axios from "axios";
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
  district: Yup.string().required("Invalid!"),
  ward: Yup.string().required("Invalid!"),
  specific: Yup.string().required(
    "Vui lòng điền thêm thông tin địa chỉ cụ thể"
  ),
});

type formValues = Yup.InferType<typeof validatingSchema>;

type optionValue = { label: string; value: string; id: string };

function ModalAddress({
  show,
  handleShow,
}: {
  show: boolean;
  handleShow: () => void;
}) {
  const user = useAppSelector((state) => state.authSlice.user);

  const [listProvince, setListProvince] = useState<optionValue[]>([]);
  const [listDistrict, setListDistrict] = useState<optionValue[]>([]);
  const [listWard, setListWard] = useState<optionValue[]>([]);
  const [address, setAddress] = useState<IAddress>();

  const id = user ? user._id : "";
  const { data, status } = useGetAddressQuery(id, { skip: !id });

  const [addAddress] = useAddAddressMutation();
  const [upDateAddress, { isLoading }] = useUpDateAddressMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<formValues>({
    defaultValues: {
      name: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      specific: "",
    },
    resolver: yupResolver(validatingSchema),
    mode: "onChange",
  });

  const handleFetchData = async ({
    params,
    id,
  }: {
    params: "province" | "district" | "ward";
    id?: string;
  }) => {
    switch (params) {
      case "province": {
        const responsive = await axios({
          method: "GET",
          url: `https://vapi.vnappmob.com/api/province`,
        });
        const data = await responsive.data.results;
        const results: optionValue[] = [];
        if (data) {
          data.forEach(
            (item: { province_name: string; province_id: string }) => {
              const label = item.province_name.includes("Tỉnh")
                ? item.province_name
                : item.province_name.replace("Thành phố", "Tp");
              results.push({
                label: label,
                value: label,
                id: item.province_id,
              });
            }
          );
        }
        setListProvince(results);
        break;
      }

      case "district": {
        const responsive = await axios({
          method: "GET",
          url: `https://vapi.vnappmob.com/api/province/${params}/${id}`,
        });
        const data = await responsive.data.results;
        const results: optionValue[] = [];
        if (data) {
          data.forEach(
            (item: { district_name: string; district_id: string }) => {
              results.push({
                label: item.district_name,
                value: item.district_name,
                id: item.district_id,
              });
            }
          );
        }
        setListDistrict(results);
        break;
      }

      case "ward": {
        const responsive = await axios({
          method: "GET",
          url: `https://vapi.vnappmob.com/api/province/${params}/${id}`,
        });
        const data = await responsive.data.results;
        const results: optionValue[] = [];
        data.length > 0
          ? data.forEach((item: { ward_name: string; ward_id: string }) => {
              results.push({
                label: item.ward_name,
                value: item.ward_name,
                id: item.ward_id,
              });
            })
          : results.push({
              label: "Không có Phường xã",
              value: "",
              id: "0",
            });
        setListWard(results);
        break;
      }
      default:
        break;
    }
  };

  useLayoutEffect(() => {
    if (data && status === "fulfilled") {
      setAddress(data.address);
    }
  }, [data, status]);

  useEffect(() => {
    if (address) {
      setValue("name", address.name);
      setValue("phone", address.phone);
      setValue("province", address.province);
      setValue("district", address.district);
      setValue("ward", address.ward || "");
      setValue("specific", address.specific);
    }
  }, [address, setValue]);

  useEffect(() => {
    handleFetchData({ params: "province" });
  }, []);

  const Onsubmit = async (data: formValues) => {
    address
      ? await upDateAddress({ id: address.userId, body: data }).unwrap()
      : await addAddress({ body: { ...data, userId: id } }).unwrap();
    if (!isLoading) {
      reset({
        name: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        specific: "",
      });
      handleShow();
    }
  };
  return (
    <Modal
      isOpenModal={show}
      onClick={() => {
        reset({
          name: "",
          phone: "",
          province: "",
          district: "",
          ward: "",
          specific: "",
        });
        handleShow();
      }}
      className={{
        content:
          "modal-content max-w-[600px] w-full p-[30px] relative bg-white rounded z-[70]",
      }}
    >
      <div
        onClick={handleShow}
        className="absolute cursor-pointer top-2 right-2 hover:text-red-600"
      >
        <IconCLose size={25}></IconCLose>
      </div>
      <h1 className="text-2xl mb-[15px]">Cập nhật địa chỉ</h1>
      <form onSubmit={handleSubmit(Onsubmit)} className="flex flex-col gap-y-7">
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
                  display: true,
                  place: "top",
                }}
                className={{
                  option: "max-h-[160px] overflow-y-scroll  rounded-none",
                }}
                onClick={(option) => {
                  setValue("province", option.value);
                  setValue("district", "");
                  setValue("ward", "");
                  handleFetchData({ params: "district", id: option.id });
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
                  display: true,
                  place: "top",
                }}
                className={{
                  select: watch("province") ? "" : "shadow-inner text-gray",
                  option: "max-h-[160px] overflow-y-scroll rounded-none",
                }}
                onClick={(option) => {
                  setValue("district", option.value);
                  setValue("ward", "");
                  handleFetchData({ params: "ward", id: option.id });
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
                  display: true,
                  place: "top",
                }}
                className={{
                  select: `${
                    watch("district") ? "" : "shadow-inner text-gray"
                  } `,
                  option: "max-h-[160px] overflow-y-scroll rounded-none",
                }}
                onClick={(option) => {
                  console.log("option: ", option);
                  setValue("ward", option.value ? option.value : "Không");
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
            // disabled={!isDirty}
            className="min-w-[130px] flex justify-center"
          >
            {isLoading ? <LoadingSpinner></LoadingSpinner> : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalAddress;
