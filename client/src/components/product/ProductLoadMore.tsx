import { useGetLoadMoreDataQuery } from "@/stores/service/product.service";
import Card from "../card";
import useTestContext from "@/hook/useTestContext";
import { CategoryContext, ICategoryProvide } from "@/module/category/context";
import { Fragment, useEffect, useRef } from "react";
import LoadingSpinner from "../loading";
import CartSkeleton from "../card/cart-skeleton";
import { useSearchParams } from "react-router-dom";
import { Button } from "../button";

function ProductLoadMore() {
  const { filter, handleSetData, handleSetFilter, data } =
    useTestContext<ICategoryProvide>(
      CategoryContext as React.Context<ICategoryProvide>
    );
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: resProduct,
    status,
    isFetching,
  } = useGetLoadMoreDataQuery(filter);

  const LoadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resProduct && status === "fulfilled") {
      handleSetData(resProduct);
    }
  }, [resProduct, handleSetData, status]);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (data && filter.activePage + 1 <= data?.totalPage && !isFetching) {
            const page = filter.activePage + 1;
            handleSetFilter({ activePage: page });
            searchParams.set("page", "" + page);
            setSearchParams(searchParams);
          }
        }
      });
    };
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    });

    if (LoadRef.current) observer.observe(LoadRef.current);

    return () => {
      observer.disconnect();
    };
  }, [data, filter.activePage, handleSetFilter, isFetching]);

  if (isFetching && filter.activePage === 1) {
    return (
      <div className="grid w-full grid-cols-4 gap-5">
        {Array(8)
          .fill(null)
          .map((_, index) => {
            return <CartSkeleton key={index}></CartSkeleton>;
          })}
      </div>
    );
  }

  const handleRemoveFilter = () => {
    searchParams.delete("sortBy");
    searchParams.delete("order");
    searchParams.delete("min_price");
    searchParams.delete("max_price");
    setSearchParams(searchParams);
    handleSetFilter({
      activePage: 1,
      sortBy: "relevancy",
      order: "",
      min_price: 0,
      max_price: 0,
    });
  };

  if (data?.data.length === 0 && !isFetching) {
    return (
      <div className="flex flex-col justify-center items-center mt-10">
        <img alt="" srcSet="/search_notfound.png" className="w-40" />
        {searchParams.size > 1 && searchParams.has("s") ? (
          <>
            <span>
              Hix. Không có sản phẩm nào. Bạn thử tắt điều kiện lọc và tìm lại
              nhé?
            </span>
            <Button
              variant="default"
              className="mt-5"
              onClick={handleRemoveFilter}
            >
              Xóa bộ lọc
            </Button>
          </>
        ) : (
          <span>Không tìm thấy kết quả nào</span>
        )}
      </div>
    );
  }

  return (
    <Fragment>
      <div className="grid w-full grid-cols-4 gap-5">
        {data?.data.map((product, index) => {
          return <Card key={index} product={product}></Card>;
        })}
      </div>
      <div className="w-full mt-5 text-center" ref={LoadRef}>
        {isFetching && (
          <LoadingSpinner className="w-10 h-10 mx-auto border-4 border-orange border-r-transparent"></LoadingSpinner>
        )}
      </div>
    </Fragment>
  );
}

export default ProductLoadMore;
