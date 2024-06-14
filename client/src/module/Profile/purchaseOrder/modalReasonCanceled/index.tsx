import { reasonCanceled } from "@/constant/order.constant";
import { cn } from "@/utils";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEditCancelledOrderMutation } from "@/stores/service/order.service";
import { RootState } from "@/stores";
import { useAppSelector } from "@/hook";
import { toast } from "react-toastify";
import Field from "@/components/fields";
import InputRadio from "@/components/input/InputRadio";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import LoadingSpinner from "@/components/loading";
import Modal from "@/components/modal";

type TProps = {
  isOpenModal: boolean;
  onClick: () => void;
  className?: {
    overlay?: string;
    content?: string;
  };
  id: string;
};

const validationSchema = Yup.object({
  reasonCanceled: Yup.string().required(),
});

type FormValues = Yup.InferType<typeof validationSchema>;

function ModalReasonCanceled({ isOpenModal, onClick, className, id }: TProps) {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      reasonCanceled: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const [editCancelledOrder, { isLoading }] = useEditCancelledOrderMutation();

  const onSubmit = async (data: FormValues) => {
    if (user) {
      const body = {
        reasonCanceled: data.reasonCanceled,
        canceller: user._id,
      };
      await editCancelledOrder({ id, body })
        .unwrap()
        .then(() => {
          reset({ reasonCanceled: "" });
          onClick();
          toast("Hủy đơn hàng thành công!", { type: "success" });
        })
        .catch(() => {
          toast("Đã xảy ra lỗi", { type: "error" });
        });
    }
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
        <div className="flex justify-end text-sm gap-x-2">
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
            type="submit"
            disabled={!watch("reasonCanceled") ? true : false}
          >
            {isLoading ? (
              <LoadingSpinner className="w-10 h-10 max-w-[150px]"></LoadingSpinner>
            ) : (
              "Hủy đơn hàng"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalReasonCanceled;
