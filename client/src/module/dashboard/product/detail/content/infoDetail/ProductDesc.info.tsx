import { IconChevronRight } from "@/components/icon";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import * as marked from "marked";
import useTestContext from "@/hook/useTestContext";
import { DetailProductContext, IDetailProductProvide } from "../../context";

function ProductDesc() {
  const { product } = useTestContext<IDetailProductProvide>(
    DetailProductContext as React.Context<IDetailProductProvide>
  );
  const [heightDesc, setHeightDesc] = useState<string>("200px");
  const [openDesc, setOpenDesc] = useState(false);

  useEffect(() => {
    setOpenDesc(false);
    setHeightDesc("200px");
  }, [product]);

  return (
    <section className="w-full mt-5 bg-white rounded-md py-5 px-[10px]">
      <h1 className="font-bold text-center underline">MÔ TẢ SẢN PHẨM</h1>
      <div
        style={{ height: heightDesc }}
        className="relative w-full mt-5 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center w-full px-5 ">
          <div
            className="flex flex-col gap-y-3 [&>p]:mx-auto"
            dangerouslySetInnerHTML={{
              __html: marked.parse(
                product && product?.desc ? product?.desc : ""
              ),
            }}
          ></div>
        </div>
        <div
          onClick={() => {
            setHeightDesc(openDesc ? "200px" : "auto");
            setOpenDesc(!openDesc);
          }}
          className={cn(
            "flex items-center justify-center absolute left-0 bottom-0 bg-white z-30 w-full h-16 ",
            "before:absolute before:w-full before:bg-whiteLinear before:bottom-full before:left-0 ",
            openDesc ? "before:h-10" : "before:h-[100px]"
          )}
        >
          <button className="text-lg relative text-gray w-[100px] h-full flex items-end justify-center">
            <span
              className={cn(
                "absolute -translate-x-1/2 left-1/2",
                openDesc
                  ? "arrow-top_up -rotate-90"
                  : "arrow-top_down rotate-90"
              )}
            >
              <IconChevronRight size={25}></IconChevronRight>
            </span>
            <span
              className={cn(
                "absolute -translate-x-1/2 left-1/2",
                openDesc
                  ? "arrow-bottom_up -rotate-90"
                  : "arrow-bottom_down rotate-90"
              )}
            >
              <IconChevronRight size={25}></IconChevronRight>
            </span>
            <span className="hover:text-orange">
              {openDesc ? "Thu gọn" : "Xem tiếp"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDesc;
