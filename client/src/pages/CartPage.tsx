import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartProvider } from "@/module/cart/context";
import CartContent from "../module/cart";
import { useSelectorAuthSlice } from "@/hook";

function CartPage() {
  const { user } = useSelectorAuthSlice();

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
    <CartProvider>
      <CartContent></CartContent>
    </CartProvider>
  );
}

export default CartPage;
