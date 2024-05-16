import { IProductRes, paramsFilterProduct } from "@/types/product.type";
import { createContext, useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

export type ICategoryProvide = {
  filter: paramsFilterProduct;

  data: {
    data: IProductRes[];
    totalPage: number;
    result_filter: number;
    result_search: IProductRes[];
  };

  maxPrice: number;

  minPrice: number;

  handleSetFilter: (value: valueFilter<paramsFilterProduct>) => void;

  handleSetData: (data: ICategoryProvide["data"]) => void;
};

type valueFilter<Type> = {
  [Property in keyof Type]?: Type[Property];
};

const CategoryContext = createContext<ICategoryProvide | null>(null);

function CategoryProvide({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();

  const { pathname, state } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("s"));
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);

  const [filter, setFilter] = useState<ICategoryProvide["filter"]>({
    activePage: Number(searchParams.get("page")) || 1,
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
      : minPrice || 0,
    max_price: Number(searchParams.get("max_price"))
      ? Number(searchParams.get("max_price"))
      : maxPrice || 0,
  });

  const [data, setData] = useState<ICategoryProvide["data"]>({
    data: [],
    totalPage: 0,
    result_filter: 0,
    result_search: [],
  });

  const handleSetData = (value: ICategoryProvide["data"]) => {
    setData(value);
  };

  const handleSetFilter = (value: valueFilter<paramsFilterProduct>) => {
    setFilter({ ...filter, ...value });
  };

  useEffect(() => {
    if (
      pathname &&
      data &&
      data.result_filter > 0 &&
      data.result_search &&
      data.result_search.length > 0
    ) {
      const product = [...data.result_search];
      const priceProduct = product.sort((a, b) => {
        let a_price = 0,
          b_price = 0;
        if (a.is_sale === "sale") {
          a_price = a.priceSale;
        } else {
          a_price = a.price;
        }
        if (b.is_sale === "sale") {
          b_price = b.priceSale;
        } else {
          b_price = b.price;
        }
        return a_price - b_price;
      });
      const min_price =
        priceProduct[0].is_sale === "sale"
          ? priceProduct[0].priceSale
          : priceProduct[0].price;
      const max_price =
        priceProduct[priceProduct.length - 1].is_sale === "sale"
          ? priceProduct[priceProduct.length - 1].priceSale
          : priceProduct[priceProduct.length - 1].price;
      setMinPrice(min_price);
      setMaxPrice(max_price);
    } else {
      setMinPrice(0);
      setMaxPrice(0);
    }
  }, [data, pathname]);

  useEffect(() => {
    if (slug && slug !== filter.search) {
      setFilter({
        ...filter,
        search: slug,
        sortBy: "relevancy",
        order: "",
        min_price: 0,
        max_price: 0,
        activePage: Number(searchParams.get("page")) || 1,
      });
    }
  }, [filter, searchParams, slug]);

  useEffect(() => {
    if (
      pathname === "/search" &&
      searchParams.get("s") === "" &&
      searchParams.get("s") !== filter.search
    ) {
      searchParams.delete("sortBy");
      searchParams.delete("order");
      searchParams.delete("min_price");
      searchParams.delete("max_price");
      setSearchParams(searchParams);
      setFilter({
        ...filter,
        search: (searchParams.get("s") as string) ? state.s : "",
        sortBy: "relevancy",
        order: "",
        min_price: 0,
        max_price: 0,
        activePage: Number(searchParams.get("page")) || 1,
      });
    }
  }, [filter, pathname, searchParams, setSearchParams, state]);

  return (
    <CategoryContext.Provider
      value={{
        filter,
        data,
        maxPrice,
        minPrice,
        handleSetFilter,
        handleSetData,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export { CategoryContext, CategoryProvide };
