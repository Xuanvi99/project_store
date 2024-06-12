import { useSearchParams } from "react-router-dom";
import ContentPurchase from "./content.purchase";
import HeaderPurchase from "./header.purchase";
import { Suspense, useEffect, useState } from "react";
import { cn } from "@/utils";
import LoadingSpinner from "@/components/loading";
import { PurchaseProvide } from "./context";

function PurchaseOrder() {
  const [searchParams] = useSearchParams();
  const [typePurchase, setTypePurchase] = useState<number>(1);

  const handleSelectTypePurchase = (type: number) => {
    setTypePurchase(type);
  };

  useEffect(() => {
    if (searchParams.get("type")) {
      setTypePurchase(Number(searchParams.get("type")));
    } else {
      setTypePurchase(1);
    }
  }, [searchParams]);

  return (
    <section className="max-w-[1000px] w-full">
      <HeaderPurchase
        type={typePurchase}
        handleSelectType={handleSelectTypePurchase}
      ></HeaderPurchase>
      <Suspense
        fallback={
          <div
            className={cn(
              "relative w-full h-[600px]",
              "before:absolute before:left-1/2 before:top-1/2  before:-translate-x-1/2 before:-translate-y-1/2 before:w-16  before:h-16 before:border-grayCa before:rounded-full before:border-4  before:z-20"
            )}
          >
            <span className="absolute z-30 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 top-1/2">
              <LoadingSpinner className="w-16 h-16 border-4 left-1/2 top-1/2 border-r-orange border-l-transparent border-t-transparent border-b-transparent"></LoadingSpinner>
            </span>
          </div>
        }
      >
        <PurchaseProvide typePurchase={typePurchase}>
          <ContentPurchase></ContentPurchase>
        </PurchaseProvide>
      </Suspense>
    </section>
  );
}

export default PurchaseOrder;
