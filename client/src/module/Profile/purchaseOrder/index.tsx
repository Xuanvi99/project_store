import HeaderNavPurchase from "./headerNav.purchase";
import { PurchaseProvide } from "./context";
import ContentPurchase from "./content.purchase";

function PurchaseOrder() {
  return (
    <section className="max-w-[1000px] w-full min-h-[600px]">
      <PurchaseProvide>
        <HeaderNavPurchase></HeaderNavPurchase>
        <ContentPurchase></ContentPurchase>
      </PurchaseProvide>
    </section>
  );
}

export default PurchaseOrder;
