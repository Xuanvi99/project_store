import { lazy } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

const Product = lazy(() => import("./product"));
const Comment = lazy(() => import("./comment"));
const Home = lazy(() => import("./home"));
const Order = lazy(() => import("./order"));

export { Sidebar, Product, Header, Comment, Home, Order };
