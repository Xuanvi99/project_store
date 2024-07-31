import { useGetListProductFilterDashboardQuery } from "@/stores/service/product.service";
import {
  IParamsFilterProductDashboard,
  IProductRes,
  TParams,
} from "@/types/product.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export interface IListPdProvide {
  data: {
    listProduct: IProductRes[];
    totalPage: number;
    amountProductFound: number;
  };

  statusQuery: QueryStatus;

  isLoadingQuery: boolean;

  filter: IParamsFilterProductDashboard;

  listSelectProductId: string[];

  setListSelectProductId: React.Dispatch<React.SetStateAction<string[]>>;

  handleSetFilter: (value: TParams<IParamsFilterProductDashboard>) => void;

  handleCheckAllProduct: (checked: boolean) => void;
}

const ListPdContext = createContext<IListPdProvide | null>(null);

function ListProductProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState<IParamsFilterProductDashboard>({
    activePage: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: (searchParams.get("search") as string) || "",
    sortBy: ["news", "sales", "price", "relevancy", ""].includes(
      searchParams.get("sortBy") as IParamsFilterProductDashboard["sortBy"]
    )
      ? (searchParams.get("sortBy") as IParamsFilterProductDashboard["sortBy"])
      : "relevancy",
    order:
      (searchParams.get("order") as IParamsFilterProductDashboard["order"]) ||
      "",
    status:
      (searchParams.get("status") as IParamsFilterProductDashboard["status"]) ||
      "",
    deleted: false,
  });

  const [listSelectProductId, setListSelectProductId] = useState<string[]>([]);

  const [data, setData] = useState<IListPdProvide["data"]>({
    listProduct: [],
    totalPage: 0,
    amountProductFound: 0,
  });

  const {
    data: resProduct,
    status: statusQuery,
    isLoading: isLoadingQuery,
  } = useGetListProductFilterDashboardQuery(filter);

  const handleSetFilter = (value: TParams<IParamsFilterProductDashboard>) => {
    setFilter((filter) => {
      return { ...filter, ...value };
    });
  };

  const handleCheckAllProduct = (checked: boolean) => {
    const listIdProduct: string[] = [];
    if (checked) {
      for (const product of data.listProduct) {
        listIdProduct.push(product._id);
      }
    } else {
      listIdProduct.slice(0, data.listProduct.length);
    }
    setListSelectProductId([...listIdProduct]);
  };

  useEffect(() => {
    if (resProduct && statusQuery === "fulfilled") {
      setData(resProduct);
      searchParams.set("search", filter.search);
      searchParams.set("limit", "" + filter.limit);
      searchParams.set("activePage", "" + filter.activePage);
      setSearchParams(searchParams);
    }
  }, [
    filter.activePage,
    filter.limit,
    filter.search,
    resProduct,
    searchParams,
    setSearchParams,
    statusQuery,
  ]);

  return (
    <ListPdContext.Provider
      value={{
        data,
        statusQuery,
        filter,
        isLoadingQuery,
        listSelectProductId,
        setListSelectProductId,
        handleSetFilter,
        handleCheckAllProduct,
      }}
    >
      {children}
    </ListPdContext.Provider>
  );
}

export { ListProductProvider, ListPdContext };
