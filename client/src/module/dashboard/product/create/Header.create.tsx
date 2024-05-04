import useTestContext from "@/hook/useTestContext";
import { CreatePdContext, ICreatePdProvide } from "./CreatePdContext";
import { Button } from "@/components/button";

function Header() {
  const { activeStep, handleActiveStep } = useTestContext<ICreatePdProvide>(
    CreatePdContext as React.Context<ICreatePdProvide>
  );

  return (
    <div className="flex w-full gap-x-6">
      <Button
        variant={activeStep === "1" ? "default" : "outLine-flex"}
        onClick={() => handleActiveStep("1")}
        className="flex items-center justify-start basis-1/3 gap-x-3"
      >
        <span>1.</span>
        <span>Tổng quan</span>
      </Button>
      <Button
        variant={activeStep === "2" ? "default" : "outLine-flex"}
        onClick={() => handleActiveStep("2")}
        className="flex items-center justify-start basis-1/3 gap-x-3"
      >
        <span>2.</span>
        <span>Hình ảnh sản phẩm</span>
      </Button>
      <Button
        variant={activeStep === "3" ? "default" : "outLine-flex"}
        onClick={() => handleActiveStep("3")}
        className="flex items-center justify-start basis-1/3 gap-x-3"
      >
        <span>3.Size - Số lượng</span>
        <span></span>
      </Button>
    </div>
  );
}

export default Header;
