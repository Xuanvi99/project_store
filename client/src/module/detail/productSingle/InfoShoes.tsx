import { useState } from "react";
import {
  IconClock,
  IconShoppingCart,
  IconStar,
  IconTag,
  IconTick,
} from "../../../components/icon";
import { cn } from "../../../utils";
import { Button } from "../../../components/button";

type sizeShoes = "" | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44;

interface IProductInfoProps {
  type: "sale" | "normal";
}

function InfoShoes({ type }: IProductInfoProps) {
  const [quantityShoes, setQuantityShoes] = useState<number>(0);
  const [sizeShoes, setSizeShoes] = useState<sizeShoes>("");

  const handleIncrement = () => {
    setQuantityShoes((quantityShoes) => quantityShoes + 1);
  };

  const handleDecrement = () => {
    if (quantityShoes === 0) return;
    setQuantityShoes((quantityShoes) => quantityShoes - 1);
  };

  const handleSizeShoes = (value: sizeShoes) => {
    if (sizeShoes === value) {
      setSizeShoes("");
      return;
    }
    setSizeShoes(value);
  };

  return (
    <div className="max-w-[500px] w-full">
      <h2
        className={cn(
          "text-xl font-bold text-left pb-2",
          "border-b-2 border-grayCa"
        )}
      >
        Giày Nike Air Jordan 1 Low ‘Aluminum’ Ice Blue Like Auth
      </h2>
      <div className="flex flex-col mt-5 gap-y-5">
        <ul className="flex gap-x-5">
          <li className="flex items-center gap-x-2">
            <p className="text-xl text-red-600 border-b-2 border-red-600">
              5.0
            </p>
            <span className="flex text-orange">
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  return <IconStar key={index} size={20}></IconStar>;
                })}
            </span>
          </li>
          <li className="border-l-[1px] border-grayCa"></li>
          <li className="flex items-center gap-x-2 text-gray">
            <p className="text-xl border-b-2 text-grayDark border-grayCa">73</p>
            Đánh Giá
          </li>
          <li className="border-l-[1px] border-grayCa"></li>
          <li className="flex items-center gap-x-2 text-gray">
            <p className="text-xl border-b-2 text-grayDark border-grayCa">
              1,6k
            </p>
            Đã Bán
          </li>
        </ul>
        <div className="flex flex-col justify-start text-sm text-grayDark gap-y-2">
          <span>Mã sản phẩm: N/A</span>
          <span>
            Tình trạng:<span className="text-green"> Còn hàng</span>
          </span>
        </div>
      </div>
      {type === "sale" && (
        <div className="w-full bg-redLinear rounded mt-5 p-[10px] grid grid-cols-2">
          <div className="grid grid-cols-1 grid-rows-3 text-white gap-y-2">
            <span>
              Giá sale:
              <strong className="ml-1 text-xl font-bold text-yellow">
                {new Intl.NumberFormat().format(850000)}₫
              </strong>
            </span>
            <span className="flex items-center">
              Giá gốc:
              <strong className="ml-1 line-through ">
                {new Intl.NumberFormat().format(850000)}₫
              </strong>
            </span>
            <span>
              Tiết kiệm:
              <strong className="ml-1 text-xl font-bold text-yellow">
                {new Intl.NumberFormat().format(850000)}₫
              </strong>
            </span>
          </div>
          <div className="grid grid-cols-1 grid-rows-3 text-right text-white gap-y-2">
            <span className="flex items-center justify-end text-xs animate-textScale gap-x-1">
              <IconClock size={14}></IconClock>
              <strong>Flash sale kết thúc sau</strong>
            </span>
            <span className="flex items-center justify-end text-sm font-bold gap-x-2">
              <span>4 Ngày</span>
              <span>4 Giờ</span>
              <span>4 Phút</span>
              <span>4 Giây</span>
            </span>
            <span className="flex items-center justify-end text-sm text-white gap-x-1">
              <IconTag size={15}></IconTag> Đã bán:
              <span>
                <strong className="text-yellow">6</strong>/7
              </span>
            </span>
          </div>
        </div>
      )}
      {type === "normal" && (
        <div className="flex items-end gap-x-3">
          <span className="text-lg font-bold">Giá:</span>
          <span className="line-through text-gray">
            {new Intl.NumberFormat().format(850000)}₫
          </span>
          <span className="text-2xl font-bold text-red-600">
            {new Intl.NumberFormat().format(850000)}₫
          </span>
        </div>
      )}
      <div className="w-full border-dashed border-[1px] border-blue rounded-lg mt-[10px]">
        <div className="bg-[#f9f9f9]  p-[10px] flex gap-x-5">
          <img alt="" srcSet="/icon-discount-bag-v2.svg" />
          <span>
            <h3 className="font-bold">Mua càng nhiều, ưu đãi càng lớn</h3>
            <i className="mt-5 text-xs font-normal">
              (Ưu đãi có thể kết thúc sớm)
            </i>
          </span>
        </div>
        <div className="p-[10px] flex flex-col gap-y-2 text-sm ">
          <span className="flex items-center gap-x-2">
            <IconTick size={20}></IconTick>
            <p>Freeship khi mua 2 đôi</p>
          </span>
          <span className="flex items-center gap-x-2">
            <IconTick size={20}></IconTick>
            <p>Tặng tất theo sản phẩm(Tùy đôi)</p>
          </span>
          <span className="flex items-center gap-x-2">
            <IconTick size={20}></IconTick>
            <p>Mua 5 đôi tặng 1 đôi</p>
          </span>
        </div>
      </div>
      <form className="flex flex-col mt-10 gap-y-10">
        <div className="grid grid-cols-[50px_calc(100%-50px)]">
          <span className="inline-block font-bold ">Size:</span>
          <div className="flex flex-wrap cursor-pointer gap-x-2 gap-y-2">
            {Array(8)
              .fill(37)
              .map((value, index) => {
                return (
                  <button
                    key={index}
                    type="button"
                    data-value={value + index}
                    onClick={() => handleSizeShoes(value + index)}
                    className={cn(
                      "px-[10px] py-[3px] border-[1px] text-center border-grayCa text-gray hover:border-orange hover:text-orange",
                      sizeShoes === value + index
                        ? "border-orange text-orange"
                        : ""
                    )}
                  >
                    {value + index}
                  </button>
                );
              })}
          </div>
        </div>
        <div className="flex items-center gap-x-3 text-gray">
          <span>Chọn số lượng:</span>
          <div className="flex items-center border-[1px] h-[40px] border-[#b5b4b4] text-grayDark">
            <button
              type="button"
              onClick={handleDecrement}
              className="h-full px-3 text-xl bg-slate-300"
            >
              -
            </button>
            <input
              type="number"
              className="w-[50px] text-center px-1 outline-none "
              size={4}
              min={1}
              onChange={(e) => setQuantityShoes(Number(e.target.value))}
              value={quantityShoes}
            />
            <button
              onClick={handleIncrement}
              type="button"
              className="h-full px-3 text-xl bg-slate-300"
            >
              +
            </button>
          </div>
          <span>(1000 sản phẩm có sẵn)</span>
        </div>
        <div className="flex items-center mb-16 font-bold gap-x-3">
          <Button type="submit" variant="outLine-flex">
            <IconShoppingCart size={20}></IconShoppingCart>
            Thêm vào giỏ hàng
          </Button>
          <Button type="submit" variant="outLine-flex">
            Mua ngay
          </Button>
        </div>
      </form>
    </div>
  );
}

export default InfoShoes;
