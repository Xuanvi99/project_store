import { createBrowserRouter } from "react-router-dom";
import {
  CategoryPage,
  HomePage,
  NotFoundPage,
  ProductDetailPage,
  LoginPage,
  SignUpPage,
  ForgotPasswordPage,
  ProfilePage,
  CartPage,
  CheckOutPage,
} from "./pages";
import LayoutRoot from "./layout/LayoutRoot";

const router = createBrowserRouter([
  {
    path: "",
    element: <LayoutRoot></LayoutRoot>,
    children: [
      {
        path: "/",
        element: <HomePage></HomePage>,
      },
      {
        path: "/category",
        element: <CategoryPage></CategoryPage>,
      },
      {
        path: "/productDetail/:slug",
        element: <ProductDetailPage></ProductDetailPage>,
      },
      {
        path: "/user/:slug",
        element: <ProfilePage></ProfilePage>,
      },
      {
        path: "/cart",
        element: <CartPage></CartPage>,
      },
      {
        path: "/checkout",
        element: <CheckOutPage></CheckOutPage>,
      },
      {
        path: "*",
        element: <NotFoundPage></NotFoundPage>,
      },
    ],
  },
  {
    path: "/auth",

    children: [
      {
        path: "/auth/login",
        element: <LoginPage></LoginPage>,
      },

      {
        path: "/auth/sign_up",
        element: <SignUpPage></SignUpPage>,
      },
      {
        path: "/auth/forgot_password/",
        element: <ForgotPasswordPage></ForgotPasswordPage>,
      },
    ],
  },
]);

export default router;
