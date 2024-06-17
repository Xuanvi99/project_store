import LayoutMain from "../layout/LayoutMain";
import AddressCheckout from "@/module/checkout/address";
import ListProductOrder from "@/module/checkout/content";
import { CheckoutProvide } from "@/module/checkout/context";
import InfoOrder from "@/module/checkout/infoOrder";

function CheckOutPage() {
  return (
    <LayoutMain className="mt-10 CheckOut">
      <CheckoutProvide>
        <AddressCheckout></AddressCheckout>
        <ListProductOrder></ListProductOrder>
        <InfoOrder></InfoOrder>
      </CheckoutProvide>
    </LayoutMain>
  );
}

export default CheckOutPage;
