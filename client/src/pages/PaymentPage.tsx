import { BannerCommon } from "@/components/banner";
import { Button } from "@/components/button";
import {
  useCreatePaymentMutation,
  useVnPayIpnQuery,
} from "@/stores/service/vnpay.service";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";

function PaymentPage() {
  const { search } = useLocation();

  const { data } = useVnPayIpnQuery(search, { skip: !search });
  console.log("data: ", data);
  const [createPayment] = useCreatePaymentMutation();

  const handleTestApi = async () => {
    await createPayment({
      totalPriceOrder: 100000,
      bankCode: "VNBANK",
      language: "vn",
    })
      .unwrap()
      .then((res) => {
        window.location.href = res.vnpUrl;
      });
  };

  return (
    <Fragment>
      <BannerCommon heading="Kết quả đơn hàng" title="Tài khoản"></BannerCommon>
      <div>
        PaymentPage
        <Button variant="default" onClick={handleTestApi}>
          Test Api
        </Button>
      </div>
    </Fragment>
  );
}

export default PaymentPage;
