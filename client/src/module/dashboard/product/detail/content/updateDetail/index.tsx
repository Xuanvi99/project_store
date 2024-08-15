import { Button } from "@/components/button";
import GeneralDetail from "./GeneralDetail.update";
import SizeAndQuantityDetail from "./SizeAndQuantityDetail.update";
import UpLoadImagesDetail from "./UpLoadImagesDetail.update";
import { useState } from "react";

const listProgress = ["Thông tin chung", "Hình ảnh ", "Size - Số lượng"];

function UpdateDetail() {
  const [activeTabUpdate, setActiveTabUpdate] = useState<number>(1);

  const handleActiveTabUpdate = (active: number) => {
    setActiveTabUpdate(active);
  };

  const selectActiveTab = (activeTabUpdate: number) => {
    switch (activeTabUpdate) {
      case 1:
        return <GeneralDetail></GeneralDetail>;

      case 2:
        return <UpLoadImagesDetail></UpLoadImagesDetail>;

      case 3:
        return <SizeAndQuantityDetail></SizeAndQuantityDetail>;

      default:
        break;
    }
  };

  return (
    <div className="flex flex-col p-5 bg-white rounded-md gap-y-3">
      <h1 className="w-full mb-5 text-2xl font-semibold text-center text-orange">
        Cập nhật thông tin
      </h1>
      <div className="flex w-full gap-x-6">
        {listProgress.map((progress, index) => {
          const stt = index + 1;
          return (
            <Button
              key={index}
              variant={activeTabUpdate === stt ? "default" : "outLine-flex"}
              onClick={() => handleActiveTabUpdate(stt)}
              className="flex items-center justify-start basis-1/3 gap-x-1"
            >
              <span>{stt}.</span>
              <span>{progress}</span>
            </Button>
          );
        })}
      </div>
      <div className="mt-5">{selectActiveTab(activeTabUpdate)}</div>
    </div>
  );
}

export default UpdateDetail;
