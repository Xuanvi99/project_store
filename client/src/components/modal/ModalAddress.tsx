import { useForm } from "react-hook-form";
import Modal from ".";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Field from "../fields/index";
import { Label } from "../label";
import InputForm from "../input/InputForm";
import { useEffect, useState } from "react";
import { Button } from "../button";
import axios from "axios";
import { DropdownForm } from "../dropdown";
import ErrorInput from "../error/ErrorInput";
import IconCLose from "../icon/IconCLose";

const validatingSchema = Yup.object({
  name: Yup.string()
    .required("Vui lòng điền tên của bạn")
    .matches(
      /^([a-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+)((\s{1}[a-vxyỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ]+){1,})$/,
      "Họ và tên không hợp lệ"
    ),
  phone: Yup.string()
    .required("Vui lòng điền Số điện thoại")
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
  province: Yup.string().required("!invalid"),
  district: Yup.string().required("!invalid"),
  ward: Yup.string().required("!invalid"),
  address: Yup.string().required("Vui lòng điền thêm thông tin cụ thể"),
});

type formValues = Yup.InferType<typeof validatingSchema>;

type optionValue = { label: string; value: string; id: string };

function ModalAddress({ show, handle }: { show: boolean; handle: () => void }) {
  const [province, setProvince] = useState<optionValue[]>([]);
  const [district, setDistrict] = useState<optionValue[]>([]);
  const [ward, setWard] = useState<optionValue[]>([]);

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
      address: "",
    },
    resolver: yupResolver(validatingSchema),
    mode: "onSubmit",
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
                ? item.province_name.slice(5)
                : item.province_name.slice(9);
              results.push({
                label: label,
                value: item.province_name,
                id: item.province_id,
              });
            }
          );
        }
        setProvince(results);
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
        setDistrict(results);
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
              value: "xã XXX",
              id: "0",
            });
        setWard(results);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    handleFetchData({ params: "province" });
  }, []);

  const Onsubmit = (data: formValues) => console.log(data);
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
          address: "",
        });
        handle();
      }}
      className={{
        content:
          "modal-content max-w-[600px] w-full p-[30px] relative bg-white rounded z-[70]",
      }}
    >
      <div
        onClick={handle}
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
              value={watch("name")}
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
              value={watch("phone")}
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
                title="Chọn Tỉnh/Thành phố"
                options={province}
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
                title={"Chọn Quận/Huyện"}
                options={district}
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
                title="Chọn Phường/Xã"
                disable={watch("district") ? false : true}
                options={ward}
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
                onClick={(option) => setValue("ward", option.value)}
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
          <Label name="address">Đại chỉ cụ thể:</Label>
          <InputForm
            control={control}
            name="address"
            id="address"
            value={watch("address")}
            error={errors.address?.message ? true : false}
            placeholder="Ví dụ: số nhà,ngõ..."
            className={{
              input: `py-1 `,
            }}
          />
          <ErrorInput text={errors.address?.message} />
        </Field>
        <div className="flex justify-end">
          <Button variant="default" type="submit">
            Cập nhật
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalAddress;
