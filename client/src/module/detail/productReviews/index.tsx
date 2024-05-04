import ReviewsComment from "./ReviewsComment";
import { IconStar } from "@/components/icon";
import { useToggle } from "@/hook";
import Modal from "@/components/modal";
import FormComment from "./comment";

const listStar = ["Tất cả", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"];

function ProductReviews() {
  const { toggle: showModal, handleToggle: handleShowModal } = useToggle();
  return (
    <section className="w-full mt-5 bg-white rounded-md py-5 px-[10px]">
      <h1 className="text-lg font-bold">ĐÁNH GIÁ - NHẬN XÉT TỪ KHÁCH HÀNG</h1>
      <div className="max-w-[1000px] w-full mx-auto mt-5 ">
        <div className=" w-full mt-5 grid grid-cols-[200px_600px_200px] border-grayCa border-[1px] py-4">
          <div className="flex flex-col text-orange">
            <span className="flex items-end justify-center text-3xl gap-x-2">
              5.0/5
            </span>
            <span className="flex justify-center">
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  return <IconStar key={index} size={20}></IconStar>;
                })}
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
          <div className="flex items-center justify-center">
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
          </div>
        </div>
        <ReviewsComment></ReviewsComment>
      </div>
    </section>
  );
}

export default ProductReviews;
