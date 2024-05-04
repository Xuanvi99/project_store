import { useEffect, useState } from "react";
import { CreatePdContext, ICreatePdProvide } from "./CreatePdContext";
import General from "./General.step1";
import Specs from "./Specs.step3";
import useTestContext from "@/hook/useTestContext";
import { isFetchBaseQueryError } from "@/stores/helpers";
import { ModalNotification } from "@/components/modal";
import { IconError, IconSuccess } from "@/components/icon";
import UpLoadImages from "./UpLoadImages.step2";

function Content() {
  const { activeStep, isSuccess, isError, error } =
    useTestContext<ICreatePdProvide>(
      CreatePdContext as React.Context<ICreatePdProvide>
    );

  const selectStep = (activeStep: string) => {
    switch (activeStep) {
      case "1":
        return <General></General>;

      case "2":
        return <UpLoadImages></UpLoadImages>;

      case "3":
        return <Specs></Specs>;

      default:
        break;
    }
  };

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenModal(false);
  };

  const handleError = () => {
    if (error && isFetchBaseQueryError(error)) {
      const data = error.data as { errMessage: string };
      return data.errMessage;
    }
    return "Tạo sản phẩm thất bại";
  };

  useEffect(() => {
    if (isSuccess || isError) {
      setOpenModal(true);
    }
  }, [isSuccess, isError]);

  return (
    <div className="content">
      <ModalNotification isOpen={openModal} onClick={handleOpenModal}>
        <div className="w-[300px] p-5 relative rounded-md overflow-hidden">
          <div className="absolute inset-0 z-50 bg-black opacity-75"></div>
          <div className="relative z-[60] flex flex-col items-center text-white gap-y-5">
            {isSuccess ? (
              <span className={`${isSuccess && "text-green"}`}>
                <IconSuccess size={50}></IconSuccess>
              </span>
            ) : (
              <span className={`text-danger`}>
                <IconError size={50}></IconError>
              </span>
            )}
            <span className="text-center">
              {isSuccess ? (
                <p>Tạo sản phẩm thành công</p>
              ) : (
                <p>{handleError()}</p>
              )}
            </span>
          </div>
        </div>
      </ModalNotification>
      {selectStep(activeStep)}
    </div>
  );
}

export default Content;
