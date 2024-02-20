import { useState } from "react";
import { Input } from "../../components/input";
import { IconDelete } from "../../components/icon";

type TCartItemProps = {
  data: {
    id: string;
    name: string;
    image: string;
    size: string;
    price: {
      main: string;
      sale: string;
    };
    quantity: number;
  };
  handleCheckCart: (id: string, checked: boolean) => void;
  isChecked: boolean;
};

function CartItem({ data, handleCheckCart, isChecked }: TCartItemProps) {
  const { id, name, image, size, price, quantity } = data;
  const [quantityShoes, setQuantityShoes] = useState<number>(quantity);

  const handleDecrement = () => {
    if (quantityShoes === 0) return;
    setQuantityShoes((quantityShoes) => quantityShoes - 1);
  };

  const handleIncrement = () => {
    setQuantityShoes((quantityShoes) => quantityShoes + 1);
  };

  const handleChangeCheckBox = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    handleCheckCart(id, event.currentTarget.checked);
  };
  return (
    <section className="cart mt-5 w-full py-[30px] shadow-sm shadow-grayCa bg-white mx-auto max-w-[1160px] rounded-[3px] flex justify-between items-center">
      <div className="flex items-center ml-5 w-[500px] gap-x-10">
        <Input
          type="checkbox"
          name="checkbox"
          onChange={(event) => handleChangeCheckBox(event, id)}
          data-id={id}
          checked={isChecked}
          className={{
            input: "w-5 h-5 cursor-pointer",
            wrap: "w-5 static",
          }}
        />
        <div className="flex gap-x-3">
          <img alt="" srcSet={image} className="w-[80px]" />
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="text-sm text-gray mt-auto">Size: {size}</span>
          </div>
        </div>
      </div>
      <div className="grid w-[560px] grid-cols-3 gap-x-2">
        <span className="flex items-center justify-center  gap-x-2">
          {price.sale ? (
            <>
              <p className="line-through text-gray text-sm">
                ₫{new Intl.NumberFormat().format(parseInt(price.main))}
              </p>
              <p className="text-red-600 ">
                ₫{new Intl.NumberFormat().format(parseInt(price.sale))}
              </p>
            </>
          ) : (
            <p> ₫{new Intl.NumberFormat().format(parseInt(price.sale))}</p>
          )}
        </span>
        <div className="flex items-center justify-center h-10 text-grayDark">
          <button
            type="button"
            onClick={handleDecrement}
            className="h-full px-3 text-xl bg-slate-300"
          >
            -
          </button>
          <input
            type="number"
            className="w-[50px] border-1 border-grayCa h-full text-center px-1 outline-none "
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
        <span className="flex items-center justify-center ">
          ₫
          {new Intl.NumberFormat().format(parseInt(price.sale) * quantityShoes)}
        </span>
      </div>
      <div className=" w-[100px] flex justify-center">
        <IconDelete size={30}></IconDelete>
      </div>
    </section>
  );
}

export default CartItem;
