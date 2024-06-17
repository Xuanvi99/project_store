import ReviewsComment from "./ReviewsComment";
import { IconStar } from "@/components/icon";
import useTestContext from "@/hook/useTestContext";
import { IProductDetailProvide, PDetailContext } from "../context";
import { useEffect, useState } from "react";

const listStar = ["Tất cả", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"];

function ProductReviews() {
  const { data } = useTestContext<IProductDetailProvide>(
    PDetailContext as React.Context<IProductDetailProvide>
  );

  const [star, setStar] = useState<string>("0");

  useEffect(() => {
    if (data) {
      if (data.commentIds.length === 0) {
        setStar("50");
      } else {
        const countStar = data.commentIds.reduce((a, b) => a + b.star, 0);
        const mediumStar =
          Math.round((countStar * 10) / data.commentIds.length) / 10;
        setStar("" + mediumStar);
      }
    }
  }, [data]);

  return (
    <section className="w-full mt-5 bg-white rounded-md py-5 px-[10px]">
      <h1 className="text-lg font-bold">ĐÁNH GIÁ - NHẬN XÉT TỪ KHÁCH HÀNG</h1>
      <div className="max-w-[1000px] w-full mx-auto mt-5 ">
        <div className=" w-full mt-5 grid grid-cols-[200px_800px] border-grayCa border-[1px] py-4">
          <div className="flex flex-col items-center justify-center text-orange">
            <div className="flex items-baseline justify-center gap-x-1">
              <span className="flex items-end justify-center text-3xl gap-x-2">
                {star[0] + "." + star[1]}
              </span>
              <span>trên</span>
              <span>5</span>
            </div>
            <span className="flex">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <IconStar size={20} key={index}></IconStar>
                ))}
            </span>
          </div>
          <div className="flex justify-center gap-x-3 flex-wrap max-h-[40px] ">
            {listStar.length > 0 &&
              listStar.map((item, index) => {
                return (
                  <span
                    key={index}
                    className="px-5 py-2 border-grayCa border-[1px] cursor-pointer hover:text-orange hover:border-orange"
                  >
                    {item}
                  </span>
                );
              })}
          </div>
          {/* <div className="flex items-center justify-center">
            <button
              onClick={handleShowModal}
              type="button"
              className="px-3 py-3 font-bold text-white rounded-lg bg-orangeLinear"
            >
              Viết đánh giá
            </button>
            <Modal onClick={handleShowModal} isOpenModal={showModal}>
              <FormComment
                type="reviews"
                handleCloseForm={handleShowModal}
                className={{
                  form: "w-[600px] rounded-lg",
                  title: "text-lg",
                  text: "max-h-[140px]",
                }}
              ></FormComment>
            </Modal>
          </div> */}
        </div>
        <ReviewsComment></ReviewsComment>
      </div>
    </section>
  );
}

export default ProductReviews;
