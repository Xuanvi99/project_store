import { Link } from "react-router-dom";
import IconChevronRight from "../icon/IconChevronRight";

function BannerCommon({ heading, title }: { heading: string; title?: string }) {
  return (
    <section className="banner-Common w-full h-[400px] border-b-4 border-b-orange">
      <div className="max-w-[1200px] h-full mx-auto px-[30px] pt-[130px] text-white font-bold">
        <div className="py-[80px] flex justify-end">
          <div className="flex flex-col w-[40%] gap-y-3">
            <h1 className="text-4xl">{heading}</h1>
            {title && (
              <div className="flex items-center justify-start font-normal gap-x-2">
                <Link to={"/"} className="hover:text-black">
                  Trang chủ
                </Link>
                <span className="flex items-center">
                  <IconChevronRight size={10}></IconChevronRight>
                </span>
                <span>{title}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BannerCommon;
