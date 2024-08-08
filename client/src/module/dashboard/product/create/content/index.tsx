import { useEffect, useState } from "react";
import { CreateProductContext, ICreateProductProvide } from "../context";
import General from "./General.step1";
import useTestContext from "@/hook/useTestContext";
import { ModalNotification } from "@/components/modal";
import UpLoadImages from "./UpLoadImages.step2";
import SizeAndQuantity from "./SizeAndQuantity.step3";

function Content() {
  const { activeStep, isSuccess, isError } =
    useTestContext<ICreateProductProvide>(
      CreateProductContext as React.Context<ICreateProductProvide>
    );

  const selectStep = (activeStep: string) => {
    switch (activeStep) {
      case "1":
        return <General></General>;

      case "2":
        return <UpLoadImages></UpLoadImages>;

      case "3":
        return <SizeAndQuantity></SizeAndQuantity>;

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
