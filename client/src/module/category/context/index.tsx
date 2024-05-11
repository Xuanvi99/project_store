import { IProductRes, paramsFilterProduct } from "@/types/product.type";
import { createContext, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export type ICategoryProvide = {
  filter: paramsFilterProduct;

  data:
    | {
        data: IProductRes[];
        totalPage: number;
        result: number;
      }
    | undefined;

  handleSetFilter: (value: valueFilter<paramsFilterProduct>) => void;

  handleSetData: (data: ICategoryProvide["data"]) => void;
};

type valueFilter<Type> = {
  [Property in keyof Type]?: Type[Property];
};

const CategoryContext = createContext<ICategoryProvide | null>(null);

function CategoryProvide({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();

  const [searchParams] = useSearchParams();
  console.log(searchParams.get("sortBy"));
  const [filter, setFilter] = useState<ICategoryProvide["filter"]>({
    activePage: 1,
    limit: 12,
    search: slug || (searchParams.get("s") as string) || "",
    sortBy: ["news", "sales", "price", "relevancy", ""].includes(
      searchParams.get("sortBy") as paramsFilterProduct["sortBy"]
    )
      ? (searchParams.get("sortBy") as paramsFilterProduct["sortBy"])
      : "relevancy",
    order: (searchParams.get("order") as paramsFilterProduct["order"]) || "",
    min_price: Number(searchParams.get("min_price"))
      ? Number(searchParams.get("min_price"))
      : 0,
    max_price: Number(searchParams.get("max_price"))
      ? Number(searchParams.get("max_price"))
      : 0,
  });

  console.log("filter", filter);

  const [data, setData] = useState<ICategoryProvide["data"] | undefined>();
  console.log("data: ", data);

  const handleSetData = (value: ICategoryProvide["data"]) => {
    setData(value);
  };

  const handleSetFilter = (value: valueFilter<paramsFilterProduct>) => {
    setFilter({ ...filter, ...value });
  };

  return (
    <CategoryContext.Provider
      value={{ filter, data, handleSetFilter, handleSetData }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export { CategoryContext, CategoryProvide };
