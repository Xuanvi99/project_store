import { useGetLoadMoreDataQuery } from "@/stores/service/product.service";
import Card from "../card";
import useTestContext from "@/hook/useTestContext";
import { CategoryContext, ICategoryProvide } from "@/module/category/context";
import { Fragment, useEffect, useRef } from "react";
import LoadingSpinner from "../loading";
import CartSkeleton from "../card/cart-skeleton";

function ProductLoadMore() {
  const { filter, handleSetData, handleSetFilter, data } =
    useTestContext<ICategoryProvide>(
      CategoryContext as React.Context<ICategoryProvide>
    );

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
            console.log("Fetching more data...");
            handleSetFilter({ activePage: filter.activePage + 1 });
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

  if (isFetching) {
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

  return (
    <Fragment>
      <div className="grid w-full grid-cols-4 gap-5">
        {data?.data.map((product, index) => {
          return (
            <Card key={index} type={product.is_sale} product={product}></Card>
          );
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
