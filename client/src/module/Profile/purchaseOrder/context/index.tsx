import { limitOrder, listHeaderOrder } from "@/constant/order.constant";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { useGetListOrderUserQuery } from "@/stores/service/order.service";
import { IResOrder, paramsGetListOrder } from "@/types/order.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { createContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export type IPurchaseProvide = {
  data: {
    data: IResOrder[];
    totalPage: number;
    amountOrder: number;
  };

  isLoading: boolean;

  typePurchase: number;

  params: paramsGetListOrder;

  statusReq: QueryStatus;

  handleSetParams: (value: TParams) => void;

  handleSelectTypePurchase: (type: number) => void;
};

type TParams = {
  [P in keyof paramsGetListOrder]?: paramsGetListOrder[P];
};

const PurchaseContext = createContext<IPurchaseProvide | null>(null);

function PurchaseProvide({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [typePurchase, setTypePurchase] = useState<number>(1);

  const handleSelectTypePurchase = (type: number) => {
    setTypePurchase(type);
  };

  const [params, setParams] = useState<paramsGetListOrder>({
    activePage: 1,
    limit: limitOrder,
    search: "",
    statusOrder: "",
  });

  const [data, setData] = useState<IPurchaseProvide["data"]>({
    data: [],
    totalPage: 0,
    amountOrder: 0,
  });

  const {
    data: resOrder,
    isLoading,
    status: statusReq,
  } = useGetListOrderUserQuery(
    {
      userId: user ? user._id : "",
      params,
    },
    { skip: user ? false : true }
  );

  const handleSetParams = (value: TParams) => {
    const paramsCopy = { ...params };
    setParams({ ...paramsCopy, ...value });
  };

  useEffect(() => {
    if (searchParams.get("type")) {
      const type = Number(searchParams.get("type"));
      if (!type || type > listHeaderOrder.length) {
        setTypePurchase(1);
        navigate("/user/account/purchaseOrder");
      } else {
        setTypePurchase(type);
      }
    } else {
      setTypePurchase(1);
    }
  }, [navigate, searchParams]);

  useEffect(() => {
    if (resOrder && statusReq === "fulfilled") {
      setData({ ...resOrder });
    }
  }, [resOrder, statusReq]);

  useEffect(() => {
    setParams({
      activePage: 1,
      limit: 4,
      search: searchParams.get("keyword") || "",
      statusOrder: listHeaderOrder[typePurchase - 1].status || "",
    });
    setData({ data: [], totalPage: 0, amountOrder: 0 });
  }, [searchParams, typePurchase]);

  return (
    <PurchaseContext.Provider
      value={{
        data,
        isLoading,
        params,
        handleSetParams,
        typePurchase,
        statusReq,
        handleSelectTypePurchase,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export { PurchaseProvide, PurchaseContext };
