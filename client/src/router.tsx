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
  DashboardPage,
  VerifyPage,
} from "./pages";
import LayoutRoot from "./layout/LayoutRoot";
import LayoutRequireAuth from "./layout/LayoutRequireAuth";
import { Comment, Dashboard, Product } from "./module/dashboard";

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
        path: "/user/account/:slug",
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
    element: <LayoutRequireAuth></LayoutRequireAuth>,
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
  {
    path: "/dashboard",
    element: <DashboardPage></DashboardPage>,
    children: [
      { path: "/dashboard/home", element: <Dashboard></Dashboard> },
      { path: "/dashboard/product/", element: <Product></Product> },
      { path: "/dashboard/comment", element: <Comment></Comment> },
    ],
  },
  {
    path: "/verify/:slug",
    element: <VerifyPage></VerifyPage>,
  },
]);

export default router;
