import useTestContext from "@/hook/useTestContext";
import { CreateProductContext, ICreateProductProvide } from "../context";
import { Button } from "@/components/button";

const listProgress = ["Tổng quan", "Hình ảnh sản phẩm", "Size - Số lượng"];

function Progress() {
  const { activeStep, handleActiveStep } =
    useTestContext<ICreateProductProvide>(
      CreateProductContext as React.Context<ICreateProductProvide>
    );

  return (
    <div className="flex w-full gap-x-6">
      {listProgress.map((progress, index) => {
        const stt = index + 1;
        return (
          <Button
            key={index}
            variant={activeStep === `${stt}` ? "default" : "outLine-flex"}
            onClick={() => handleActiveStep(`${stt}`)}
            disabled={activeStep === `${stt}` ? false : true}
            className="flex items-center justify-start basis-1/3 gap-x-3"
          >
            <span>{stt}.</span>
            <span>{progress}</span>
          </Button>
        );
      })}
    </div>
  );
}

export default Progress;
