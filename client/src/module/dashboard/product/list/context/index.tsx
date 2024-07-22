import { useGetListProductFilterQuery } from "@/stores/service/product.service";
import {
  IProductRes,
  paramsFilterProduct,
  TParams,
} from "@/types/product.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export interface IListPdProvide {
  data: {
    listProduct: IProductRes[];
    totalPage: number;
    amount_filter: number;
  };

  statusQuery: QueryStatus;

  filter: paramsFilterProduct;

  handleSetFilter: (value: TParams<paramsFilterProduct>) => void;
}

const ListPdContext = createContext<IListPdProvide | null>(null);

function ListProductProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();

  const [filter, setFilter] = useState<paramsFilterProduct>({
    activePage: Number(searchParams.get("page")) || 1,
    limit: 10,
    search: (searchParams.get("search") as string) || "",
    sortBy: ["news", "sales", "price", "relevancy", ""].includes(
      searchParams.get("sortBy") as paramsFilterProduct["sortBy"]
    )
      ? (searchParams.get("sortBy") as paramsFilterProduct["sortBy"])
      : "relevancy",
    order: (searchParams.get("order") as paramsFilterProduct["order"]) || "",
  });

  const [data, setData] = useState<IListPdProvide["data"]>({
    listProduct: [],
    totalPage: 0,
    amount_filter: 0,
  });

  const { data: resProduct, status: statusQuery } =
    useGetListProductFilterQuery(filter);

  const handleSetFilter = (value: TParams<paramsFilterProduct>) => {
    setFilter((filter) => {
      return { ...filter, ...value };
    });
  };

  useEffect(() => {
    if (resProduct && statusQuery === "fulfilled") {
      setData(resProduct);
    }
  }, [resProduct, statusQuery]);

  return (
    <ListPdContext.Provider
      value={{ data, statusQuery, filter, handleSetFilter }}
    >
      {children}
    </ListPdContext.Provider>
  );
}

export { ListProductProvider, ListPdContext };
