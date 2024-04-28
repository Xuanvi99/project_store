import { useEffect, useState } from "react";
import { IconError, IconSuccess } from "../../../../components/icon";
import { ModalNotification } from "../../../../components/modal";
import useTestContext from "../../../../hook/useTestContext";
import { CreatePdContext, ICreatePdProvide } from "./CreatePdContext";
import General from "./General.step1";
import Images from "./Images.step2";
import Specs from "./Specs.step3";
import { isFetchBaseQueryError } from "../../../../stores/helpers";

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
        return <Images></Images>;

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
          {isSuccess ? <p>Tạo sản phẩm thành công</p> : <p>{handleError()}</p>}
        </span>
      </ModalNotification>
      {selectStep(activeStep)}
    </div>
  );
}

export default Content;
