import { useEffect, useState } from "react";
import { CreatePdContext, ICreatePdProvide } from "./CreatePdContext";
import General from "./General.step1";
import Specs from "./Specs.step3";
import useTestContext from "@/hook/useTestContext";
import { ModalNotification } from "@/components/modal";
import UpLoadImages from "./UpLoadImages.step2";

function Content() {
  const { activeStep, isSuccess, isError } = useTestContext<ICreatePdProvide>(
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

  useEffect(() => {
    if (isSuccess || isError) {
      setOpenModal(true);
    }
  }, [isSuccess, isError]);

  return (
    <div className="content">
      <ModalNotification
        type={isSuccess ? "success" : "error"}
        time={700}
        isOpenModal={openModal}
        onClick={handleOpenModal}
      >
        <span className="text-center">
          {isSuccess ? (
            <p>Tạo sản phẩm thành công</p>
          ) : (
            <p>Tạo sản phẩm thất bại</p>
          )}
        </span>
      </ModalNotification>
      {selectStep(activeStep)}
    </div>
  );
}

export default Content;
