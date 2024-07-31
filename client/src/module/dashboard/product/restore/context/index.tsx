import { useGetListProductDeletedQuery } from "@/stores/service/product.service";
import {
  TParamsListProduct,
  TParams,
  IResProductDeleted,
} from "@/types/product.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export interface IRestorePdProvide {
  data: {
    listProduct: IResProductDeleted[];
    totalPage: number;
    amountProductFound: number;
  };

  params: TParamsListProduct;

  statusQuery: QueryStatus;

  listSelectProductId: string[];

  isLoadingQuery: boolean;

  setListSelectProductId: React.Dispatch<React.SetStateAction<string[]>>;

  handleCheckAllProduct: (checked: boolean) => void;

  handleSetParams: (value: TParams<TParamsListProduct>) => void;
}

const RestorePdContext = createContext<IRestorePdProvide | null>(null);

const RestorePdProvide = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [params, setParams] = useState<TParamsListProduct>({
    activePage: 1,
    limit: 10,
    search: "",
  });

  const [listSelectProductId, setListSelectProductId] = useState<string[]>([]);

  const [data, setData] = useState<IRestorePdProvide["data"]>({
    listProduct: [],
    totalPage: 0,
    amountProductFound: 0,
  });

  const {
    data: resQuery,
    status: statusQuery,
    isLoading: isLoadingQuery,
  } = useGetListProductDeletedQuery(params);

  const handleSetParams = (value: TParams<TParamsListProduct>) => {
    setParams((params) => {
      return { ...params, ...value };
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
    if (resQuery && statusQuery === "fulfilled") {
      setData(resQuery);
      searchParams.set("search", params.search);
      searchParams.set("limit", "" + params.limit);
      searchParams.set("activePage", "" + params.activePage);
      setSearchParams(searchParams);
    }
  }, [
    params.activePage,
    params.limit,
    params.search,
    resQuery,
    searchParams,
    setSearchParams,
    statusQuery,
  ]);
  return (
    <RestorePdContext.Provider
      value={{
        data,
        statusQuery,
        params,
        listSelectProductId,
        setListSelectProductId,
        handleSetParams,
        handleCheckAllProduct,
        isLoadingQuery,
      }}
    >
      {children}
    </RestorePdContext.Provider>
  );
};

export { RestorePdProvide, RestorePdContext };
