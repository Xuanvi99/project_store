import LoadingSpinner from "@/components/loading";
import { useGetDetailProductQuery } from "@/stores/service/product.service";
import { IProductRes, TProductItem } from "@/types/product.type";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export interface IDetailProductProvide {
  product: IProductRes | null;

  listProductItem: TProductItem[] | [];

  statusQuery: QueryStatus;

  isLoading: boolean;
}

const DetailProductContext = createContext<IDetailProductProvide | null>(null);

const DetailProductProvide = ({ children }: { children: React.ReactNode }) => {
  const { slug } = useParams();

  const [product, setProduct] = useState<IProductRes | null>(null);

  const [listProductItem, setListProductItem] = useState<TProductItem[] | []>(
    []
  );

  const {
    data: resQuery,
    status: statusQuery,
    isLoading,
  } = useGetDetailProductQuery(slug || "", { skip: !slug });

  useEffect(() => {
    if (resQuery && statusQuery === "fulfilled") {
      const product = resQuery.product;
      setProduct(product);
      setListProductItem(resQuery.listProductItem);
    }
  }, [resQuery, statusQuery]);

  if (!product) {
    return (
      <div className="flex items-center justify-center w-full h-[600px]">
        <LoadingSpinner className="w-16 h-16 border-4 border-orangeFe border-r-transparent"></LoadingSpinner>
      </div>
    );
  }

  return (
    <DetailProductContext.Provider
      value={{ product, listProductItem, statusQuery, isLoading }}
    >
      {children}
    </DetailProductContext.Provider>
  );
};

export { DetailProductProvide, DetailProductContext };
