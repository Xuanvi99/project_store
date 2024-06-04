import { Fragment } from "react";
import { BannerCommon } from "../components/banner";
import LayoutMain from "../layout/LayoutMain";
import AddressCheckout from "@/module/checkout/address";
import ListProductOrder from "@/module/checkout/content";
import { CheckoutProvide } from "@/module/checkout/context";
import InfoOrder from "@/module/checkout/infoOrder";

function CheckOutPage() {
  return (
    <Fragment>
      <BannerCommon heading="Thanh Toán" title="Thanh Toán "></BannerCommon>
      <LayoutMain>
        <CheckoutProvide>
          <AddressCheckout></AddressCheckout>
          <ListProductOrder></ListProductOrder>
          <InfoOrder></InfoOrder>
        </CheckoutProvide>
      </LayoutMain>
    </Fragment>
  );
}

export default CheckOutPage;
