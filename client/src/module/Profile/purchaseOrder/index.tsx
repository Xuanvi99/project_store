import { useSearchParams } from "react-router-dom";
import ContentPurchase from "./content.purchase";
import HeaderPurchase from "./header.purchase";
import { useEffect, useState } from "react";

function PurchaseOrder() {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState<number>(0);
  const handleSelectType = (type: number) => {
    setType(type);
  };

  useEffect(() => {
    if (searchParams.get("type")) {
      setType(Number(searchParams.get("type")));
    } else {
      setType(1);
    }
  }, [searchParams]);

  return (
    <section className="max-w-[1000px] w-full">
      <HeaderPurchase
        type={type}
        handleSelectType={handleSelectType}
      ></HeaderPurchase>
      <ContentPurchase type={type}></ContentPurchase>
    </section>
  );
}

export default PurchaseOrder;
