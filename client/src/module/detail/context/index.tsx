import { useGetOneProductQuery } from "@/stores/service/product.service";
import { IProductRes, productItem } from "@/types/product.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { createContext } from "react";
import { useParams } from "react-router-dom";

export type IProductDetailProvide = {
  data: IProductRes | undefined;
  listProductItem: productItem[] | undefined;
  status: QueryStatus;
  isLoading: boolean;
};

const PDetailContext = createContext<IProductDetailProvide | null>(null);

function ProductDetailProvide({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();

  const {
    data: res,
    status,
    isLoading,
  } = useGetOneProductQuery(slug?.split("_")[1] as string);

  return (
    <PDetailContext.Provider
      value={{
        data: res?.data,
        listProductItem: res?.listProductItem,
        status,
        isLoading,
      }}
    >
      {children}
    </PDetailContext.Provider>
  );
}

export { ProductDetailProvide, PDetailContext };
