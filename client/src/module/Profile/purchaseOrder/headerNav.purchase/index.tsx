import { listHeaderOrder } from "@/constant/order.constant";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { useGetAmountOrderUserQuery } from "@/stores/service/order.service";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IPurchaseProvide, PurchaseContext } from "../context";
import useTestContext from "@/hook/useTestContext";

function HeaderNavPurchase() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { handleSelectTypePurchase, typePurchase } =
    useTestContext<IPurchaseProvide>(
      PurchaseContext as React.Context<IPurchaseProvide>
    );

  return (
    <header className="sticky top-0 z-40 grid grid-flow-row grid-cols-7 bg-white rounded-sm shadow-[0_5px_10px_rgba(0,0,0,0.2)]">
      {listHeaderOrder.map((item, index) => {
        return (
          <NavItem
            key={item.id}
            data={item}
            activeItem={typePurchase === index + 1 ? true : false}
            onClick={() => {
              window.scrollTo(0, 0);
              const type = index + 1;
              type !== 1 && searchParams.delete("keyword");
              searchParams.set("type", type.toString());
              setSearchParams(searchParams);
              handleSelectTypePurchase(type);
            }}
          ></NavItem>
        );
      })}
    </header>
  );
}

const NavItem = ({
  data,
  activeItem,
  onClick,
}: {
  data: { id: number; title: string; status: string };
  activeItem: boolean;
  onClick: () => void;
}) => {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const { id, title, status } = data;

  const [amountOrder, setAmountOrder] = useState<number>(0);

  const { data: resData, status: statusReq } = useGetAmountOrderUserQuery(
    {
      id: user ? user._id : "",
      statusOrder: status,
    },
    { skip: user ? (id === 2 || id === 3 || id === 4 ? false : true) : true }
  );

  useEffect(() => {
    if (resData && statusReq === "fulfilled") {
      setAmountOrder(resData.amountOrder);
    }
  }, [resData, statusReq]);

  return (
    <div
      className={cn(
        `py-4 cursor-pointer hover:text-orange flex gap-x-1 items-center justify-center`,
        activeItem && "text-orange border-b-4 border-b-orange"
      )}
      onClick={onClick}
    >
      <span>{title}</span>
      {amountOrder > 0 && <span className="text-danger">({amountOrder})</span>}
    </div>
  );
};

export default HeaderNavPurchase;
