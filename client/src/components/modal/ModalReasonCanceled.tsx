import { reasonCanceled } from "@/constant/order.constant";
import Modal from ".";
import { cn } from "@/utils";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputRadio from "../input/InputRadio";
import { Button } from "../button";
import Field from "../fields";
import { Label } from "../label";

type TProps = {
  isOpenModal: boolean;
  onClick: () => void;
  className?: {
    overlay?: string;
    content?: string;
  };
};

const validationSchema = Yup.object({
  reasonCanceled: Yup.string(),
});

type FormValues = Yup.InferType<typeof validationSchema>;

function ModalReasonCanceled({ isOpenModal, onClick, className }: TProps) {
  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      reasonCanceled: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
  };

  return (
    <Modal
      variant={"fixed"}
      isOpenModal={isOpenModal}
      className={{
        overlay: cn("opacity-60", className?.overlay),
        content: cn("bg-white p-10 rounded-sm", className?.content),
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
        <h1 className="text-xl font-bold">Lý Do Hủy</h1>
        <div className="flex flex-col gap-y-5">
          {reasonCanceled.map((reason) => {
            return (
              <Field variant="flex-row" key={reason.id}>
                <InputRadio
                  control={control}
                  name="reasonCanceled"
                  id={reason.value}
                  value={reason.value}
                  checked={watch("reasonCanceled") === reason.value}
                ></InputRadio>
                <Label className="text-base">{reason.value}</Label>
              </Field>
            );
          })}
        </div>
        <div className="flex justify-end gap-x-2">
          <Button
            variant="outLine-border"
            onClick={() => {
              reset({ reasonCanceled: "" });
              onClick();
            }}
          >
            Trở lại
          </Button>
          <Button
            variant="default"
            disabled={!watch("reasonCanceled") ? true : false}
          >
            Hủy đơn hàng
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalReasonCanceled;
