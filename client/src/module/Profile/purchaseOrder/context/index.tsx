import { listHeaderOrder } from "@/constant/order.constant";
import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";
import { useGetListOrderUserQuery } from "@/stores/service/order.service";
import { IResOrder, paramsGetListOrder } from "@/types/order.type";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export type IPurchaseProvide = {
  data: {
    data: IResOrder[];
    totalPage: number;
    amountOrder: number;
  };
  isLoading: boolean;

  typePurchase: number;

  params: paramsGetListOrder;

  handleSetParams: (value: TParams) => void;
};

type TParams = {
  [P in keyof paramsGetListOrder]?: paramsGetListOrder[P];
};

const PurchaseContext = createContext<IPurchaseProvide | null>(null);

function PurchaseProvide({
  typePurchase,
  children,
}: {
  typePurchase: number;
  children: React.ReactNode;
}) {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const [searchParams] = useSearchParams();

  const [params, setParams] = useState<paramsGetListOrder>({
    activePage: 1,
    limit: 4,
    search: "",
    status: "",
  });

  const [data, setData] = useState<IPurchaseProvide["data"]>({
    data: [],
    totalPage: 0,
    amountOrder: 0,
  });

  const {
    data: resData,
    isLoading,
    status,
  } = useGetListOrderUserQuery(
    {
      id: user ? user._id : "",
      params,
    },
    { skip: user ? false : true }
  );

  const handleSetParams = (value: TParams) => {
    const paramsCopy = { ...params };
    setParams({ ...paramsCopy, ...value });
  };

  useEffect(() => {
    setParams({
      activePage: 1,
      limit: 4,
      search: searchParams.get("keyword") || "",
      status: listHeaderOrder[typePurchase - 1].status || "",
    });
  }, [searchParams, typePurchase]);

  useEffect(() => {
    if (resData && status === "fulfilled") {
      setData({ ...resData });
    }
  }, [resData, status]);

  return (
    <PurchaseContext.Provider
      value={{ data, isLoading, params, handleSetParams, typePurchase }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export { PurchaseProvide, PurchaseContext };
