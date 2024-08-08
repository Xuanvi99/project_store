import { useGetDetailProductQuery } from "@/stores/service/product.service";
import { IProductRes, TProductItem } from "@/types/product.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export type IProductDetailProvide = {
  product: IProductRes | undefined;
  listProductItem: TProductItem[] | [];
  status: QueryStatus;
  isLoading: boolean;
};

const PDetailContext = createContext<IProductDetailProvide | null>(null);

function ProductDetailProvide({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();

  const [product, setProduct] = useState<IProductRes | undefined>(undefined);

  const [listProductItem, setListProductItem] = useState<TProductItem[] | []>(
    []
  );

  const {
    data: resQuery,
    status,
    isLoading,
  } = useGetDetailProductQuery(slug?.split("_")[1] as string);

  useEffect(() => {
    if (resQuery && status === "fulfilled") {
      setProduct(resQuery.product);
      setListProductItem(resQuery.listProductItem);
    }
  }, [resQuery, status]);

  return (
    <PDetailContext.Provider
      value={{
        product,
        listProductItem,
        status,
        isLoading,
      }}
    >
      {children}
    </PDetailContext.Provider>
  );
}

export { ProductDetailProvide, PDetailContext };
