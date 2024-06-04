import { lazy } from "react";

const HomePage = lazy(() => import("./HomePage"));
const CategoryOrSearchPage = lazy(() => import("./CategoryOrSearchPage"));
const ProductDetailPage = lazy(() => import("./ProductDetailPage"));
const NotFoundPage = lazy(() => import("./NotFoundPage"));
const LoginPage = lazy(() => import("./LoginPage"));
const SignUpPage = lazy(() => import("./SignUpPage"));
const ForgotPasswordPage = lazy(() => import("./ForgotPasswordPage"));
const ProfilePage = lazy(() => import("./ProfilePage"));
const CartPage = lazy(() => import("./CartPage"));
const CheckOutPage = lazy(() => import("./CheckOutPage"));
const DashboardPage = lazy(() => import("./DashboardPage"));
const VerifyPage = lazy(() => import("./VerifyPage"));
const PaymentPage = lazy(() => import("./PaymentPage"));

export {
  HomePage,
  NotFoundPage,
  CategoryOrSearchPage,
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
};
