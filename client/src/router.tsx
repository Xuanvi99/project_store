import { createBrowserRouter } from "react-router-dom";
import {
  CategoryOrSearchPage,
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
  PaymentPage,
} from "./pages";
import LayoutRoot from "./layout/LayoutRoot";
import LayoutRequireAuth from "./layout/LayoutRequireAuth";
import * as Dashboard from "./module/dashboard";

// async function loader() {
//   await store
//     .dispatch(
//       productApi.endpoints.getListProduct.initiate({
//         search: "adidas",
//         activePage: 1,
//         limit: 10,
//       })
//     )
//     .unwrap()
//     .then((response) => {
//       return response;
//     });
// }

const router = createBrowserRouter([
  {
    path: "",
    children: [
      {
        path: "",
        element: <LayoutRoot menu={"scroll"}></LayoutRoot>,
        children: [
          {
            path: "/",
            element: <HomePage></HomePage>,
          },
          {
            path: "/category/:slug",
            element: <CategoryOrSearchPage></CategoryOrSearchPage>,
          },
          {
            path: "/search",
            element: <CategoryOrSearchPage></CategoryOrSearchPage>,
          },
          {
            path: "/product_detail/:slug",
            element: <ProductDetailPage></ProductDetailPage>,
          },
        ],
      },
      {
        path: "",
        element: <LayoutRoot menu={"normal"}></LayoutRoot>,
        children: [
          {
            path: "/user/account/:slug",
            element: <ProfilePage></ProfilePage>,
          },
          {
            path: "/cart",
            element: <CartPage></CartPage>,
          },
          {
            path: "/checkout/",
            element: <CheckOutPage></CheckOutPage>,
          },
          {
            path: "/payment/:codeOrder",
            element: <PaymentPage></PaymentPage>,
          },
          {
            path: "*",
            element: <NotFoundPage></NotFoundPage>,
          },
        ],
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
      { path: "/dashboard/home", element: <Dashboard.Home></Dashboard.Home> },
      {
        path: "/dashboard/product",
        children: [
          {
            path: "/dashboard/product/home",
            element: <Dashboard.Product.Home></Dashboard.Product.Home>,
          },
          {
            path: "/dashboard/product/create",
            element: <Dashboard.Product.Create></Dashboard.Product.Create>,
          },
          {
            path: "/dashboard/product/restore",
            element: <Dashboard.Product.Restore></Dashboard.Product.Restore>,
          },
          {
            path: "/dashboard/product/detail/:slug",
            element: <Dashboard.Product.Detail></Dashboard.Product.Detail>,
          },
        ],
      },
      {
        path: "/dashboard/order",
        children: [
          {
            path: "/dashboard/order/home",
            element: <Dashboard.Order.Home></Dashboard.Order.Home>,
          },
          {
            path: "/dashboard/order/detail/:slug",
            element: <Dashboard.Order.Detail></Dashboard.Order.Detail>,
          },
          {
            path: "/dashboard/order/print",
            element: <Dashboard.Order.Print></Dashboard.Order.Print>,
          },
        ],
      },
      {
        path: "/dashboard/inventory",
        element: <Dashboard.Inventory></Dashboard.Inventory>,
      },
      {
        path: "/dashboard/comment",
        element: <Dashboard.Comment></Dashboard.Comment>,
      },
      {
        path: "/dashboard/message",
        element: <Dashboard.Message></Dashboard.Message>,
      },
    ],
  },
  {
    path: "/verify/:slug",
    element: <VerifyPage></VerifyPage>,
  },
]);

export default router;
