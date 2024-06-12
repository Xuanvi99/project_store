import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/input";
import { debounce } from "lodash";
import LoadingSpinner from "@/components/loading";
import { IconSearch } from "@/components/icon";
import { useSearchParams } from "react-router-dom";
import useTestContext from "@/hook/useTestContext";
import { IPurchaseProvide, PurchaseContext } from "../context";
import OrderItem from "./OrderItem";

function ContentPurchase() {
  const { data, isLoading, handleSetParams, params, typePurchase } =
    useTestContext<IPurchaseProvide>(
      PurchaseContext as React.Context<IPurchaseProvide>
    );

  const [searchParams, setSearchParams] = useSearchParams();

  const [textSearch, setTextSearch] = useState<string>(params.search);

  const LoadRef = useRef<HTMLDivElement>(null);

  const debounceHandleSearch = useMemo(() => {
    return debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        handleSetParams({
          search: event.target.value,
          activePage: 1,
          status: "",
        });
        searchParams.set("keyword", event.target.value);
        setSearchParams(searchParams);
      },
      500,
      { trailing: true }
    );
  }, [handleSetParams, searchParams, setSearchParams]);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearch(event.target.value);
    debounceHandleSearch(event);
  };

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (data && params.activePage + 1 <= data.totalPage && !isLoading) {
            handleSetParams({ activePage: params.activePage + 1 });
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
  }, [data, handleSetParams, isLoading, params]);

  if (!data || data.data.length === 0) {
    return (
      <div className="rounded-sm min-h-[600px] mt-3 bg-white flex flex-col justify-center items-center gap-y-3">
        <img alt="" srcSet="/orderNull.png" className="w-40" />
        <p>Chưa có đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-5">
      {typePurchase === 1 && (
        <Input
          type="text"
          name="search"
          id="search"
          value={textSearch}
          onChange={(event) => handleChangeSearch(event)}
          placeholder="Bạn có thể tìm kiếm theo ID đơn hàng hoặc Tên Sản phẩm"
          className={{
            input:
              "w-full pl-10 outline-none text-base py-3 border-none bg-grayE5 ",
          }}
          autoComplete="off"
        >
          <div className="absolute text-black -translate-y-1/2 top-1/2 left-2">
            <IconSearch size={25}></IconSearch>
          </div>
        </Input>
      )}
      {isLoading && params.activePage === 1 ? (
        <div className="w-full rounded-sm min-h-[600px] mt-5 text-center">
          <LoadingSpinner className="w-10 h-10 mx-auto border-4 border-orange border-r-transparent"></LoadingSpinner>
        </div>
      ) : (
        <div className="rounded-sm min-h-[600px] mt-5">
          <div className="flex flex-col gap-y-5">
            {data &&
              data.data.map((order, index) => {
                return <OrderItem key={index} data={order}></OrderItem>;
              })}
          </div>
          <div className="w-full mt-5 text-center" ref={LoadRef}>
            {isLoading && (
              <LoadingSpinner className="w-10 h-10 mx-auto border-4 border-orange border-r-transparent"></LoadingSpinner>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentPurchase;
