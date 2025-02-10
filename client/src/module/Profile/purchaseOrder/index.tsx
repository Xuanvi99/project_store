import ContentPurchase from "./content.purchase";
import { PurchaseProvide } from "./context";
import HeaderNavPurchase from "./headerNav.purchase";

function PurchaseOrder() {
  return (
    <section className="max-w-[1000px] w-full min-h-[600px]">
      <PurchaseProvide>
        <HeaderNavPurchase />
        <ContentPurchase />
      </PurchaseProvide>
    </section>
  );
}

export default PurchaseOrder;
