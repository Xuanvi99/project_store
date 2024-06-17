// import { IconChevronRight } from "../icon";
// import { cn } from "../../utils";
// import { Link } from "react-router-dom";

export default function BannerHome() {
  return (
    <section className="w-full h-[620px] banner-Slideshows">
      <div className="max-w-[1200px] mx-auto max-h-[400px] flex pt-[150px]">
        {/* <div className="flex gap-x-[30px]">
          <div className="pl-[25px] py-[27px] max-w-[475px] flex flex-col gap-y-[30px] overflow-hidden">
            <h2 className="text-6xl font-bold text-orange">
              Nike New Collection!
            </h2>
            <p className="text-sm leading-6 text-left text-gray">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor
              sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation.
            </p>
            <button
              className={cn(
                "max-w-[160px] mt-auto bg-orangeLinear shadow-[0_10px_20px_rgba(255,108,0,0.2)]",
                "text-white text-xl rounded-lg font-bold transition-colors duration-500"
              )}
            >
              <Link to="" className="flex items-center px-3 py-2 gap-x-1 ">
                Xem chi tiết
                <IconChevronRight size={15}></IconChevronRight>
              </Link>
            </button>
          </div>
          <div className="max-w-[635px] relative w-full h-[450px] z-40">
            <img
              alt=""
              loading="lazy"
              srcSet="/banner-shoes.png"
              className="absolute w-full h-auto -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 -rotate-3"
            />
          </div>
        </div> */}
        <img
          alt=""
          srcSet="./Banner1.png"
          className="h-[400px] w-[800px] object-cover"
        />
        <img
          alt=""
          srcSet="./banner2.png"
          className="h-[400px] min-w-[400px] object-cover"
        />
      </div>
    </section>
  );
}
