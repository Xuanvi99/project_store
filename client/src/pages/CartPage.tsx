import { Fragment, useEffect } from "react";
import { BannerCommon } from "../components/banner";

import { useAppSelector } from "@/hook";
import { RootState } from "@/stores";

import { useLocation, useNavigate } from "react-router-dom";
import { CartProvider } from "@/module/cart/context.cart";
import Container from "../module/cart";

function CartPage() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const redirectUrl = import.meta.env.VITE_DOMAIN_CLIENT + pathname;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!user) {
      const query = encodeURIComponent(redirectUrl);
      navigate("/auth/login?next=" + query, { state: { path: pathname } });
    }
  }, [navigate, pathname, redirectUrl, user]);

  return (
    <Fragment>
      <BannerCommon heading="Giỏ Hàng Của Bạn" title="Giỏ hàng "></BannerCommon>
      <CartProvider>
        <Container></Container>
      </CartProvider>
    </Fragment>
  );
}

export default CartPage;
