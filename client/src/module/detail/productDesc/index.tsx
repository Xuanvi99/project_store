import { IconChevronRight } from "@/components/icon";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import * as marked from "marked";
import useTestContext from "@/hook/useTestContext";
import { IProductDetailProvide, PDetailContext } from "../context";

function ProductDesc() {
  const { product } = useTestContext<IProductDetailProvide>(
    PDetailContext as React.Context<IProductDetailProvide>
  );
  const [heightDesc, setHeightDesc] = useState<string>("200px");
  const [openDesc, setOpenDesc] = useState(false);

  useEffect(() => {
    setOpenDesc(false);
    setHeightDesc("200px");
  }, [product]);

  return (
    <section className="w-full mt-5 bg-white rounded-md py-5 px-[10px]">
      <h1 className="text-lg font-bold">MÔ TẢ SẢN PHẨM</h1>
      <div
        style={{ height: heightDesc }}
        className="relative w-full mt-5 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center w-full px-5">
          <div
            dangerouslySetInnerHTML={{
              __html: marked.parse(
                product && product?.desc ? product?.desc : ""
              ),
            }}
          ></div>
        </div>
        {!openDesc && (
          <div
            onClick={() => {
              setHeightDesc("auto");
              setOpenDesc(true);
            }}
            className={cn(
              "flex items-center justify-center absolute left-0 bottom-0 bg-white z-30 w-full h-16 ",
              "before:absolute before:h-14 before:w-full before:bg-whiteLinear before:bottom-full before:left-0 "
            )}
          >
            <button className="text-lg relative text-gray w-[100px] h-full flex items-end justify-center">
              <span className="absolute rotate-90 -translate-x-1/2 arrow-top left-1/2">
                <IconChevronRight size={25}></IconChevronRight>
              </span>
              <span className="absolute rotate-90 -translate-x-1/2 arrow-bottom left-1/2">
                <IconChevronRight size={25}></IconChevronRight>
              </span>
              <span className="hover:text-orange">Xem tiếp</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDesc;
