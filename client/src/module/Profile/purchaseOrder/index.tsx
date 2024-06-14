import HeaderPurchase from "./header.purchase";
import { PurchaseProvide } from "./context";
import ContentPurchase from "./content.purchase";

function PurchaseOrder() {
  return (
    <section className="max-w-[1000px] w-full">
      <PurchaseProvide>
        <HeaderPurchase></HeaderPurchase>
        <ContentPurchase></ContentPurchase>
      </PurchaseProvide>
    </section>
  );
}

export default PurchaseOrder;
