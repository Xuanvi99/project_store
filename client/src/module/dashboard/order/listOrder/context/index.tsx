import { useGetListOrderFilterQuery } from "@/stores/service/order.service";
import { IResOrder, paramsGetListOrderFilter } from "@/types/order.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import React, { createContext, useEffect, useState } from "react";

export interface IListOrderFilterProvider {
  res: {
    data: IResOrder[];
    totalPage: number;
    amountOrder: number;
  };

  status: QueryStatus;

  handleSetParams: (value: TParams) => void;
}

type TParams = {
  [P in keyof paramsGetListOrderFilter]?: paramsGetListOrderFilter[P];
};

const ListOrderFilterContext = createContext<IListOrderFilterProvider | null>(
  null
);

function ListOrderProvide({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useState<paramsGetListOrderFilter>({
    activePage: 1,
    limit: 10,
    search: "",
    statusOrder: "",
    paymentStatus: "",
    paymentMethod: "",
    dateStart: "",
    dateEnd: "",
  });

  const { data: fetchData, status } = useGetListOrderFilterQuery(params);

  const [res, setRes] = useState<IListOrderFilterProvider["res"]>({
    data: [],
    totalPage: 0,
    amountOrder: 0,
  });

  const handleSetParams = (value: TParams) => {
    const paramsCopy = { ...params };
    setParams({ ...paramsCopy, ...value });
  };

  useEffect(() => {
    if (fetchData && status === "fulfilled") {
      setRes({ ...fetchData });
    }
  }, [fetchData, status]);

  return (
    <ListOrderFilterContext.Provider value={{ res, handleSetParams, status }}>
      {children}
    </ListOrderFilterContext.Provider>
  );
}

export { ListOrderProvide, ListOrderFilterContext };
