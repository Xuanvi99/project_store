import { lazy } from "react";
import Navbar from "./navbar";
import Header from "./header";

const Product = lazy(() => import("./product"));
const Comment = lazy(() => import("./comment"));
const Dashboard = lazy(() => import("./home"));

export { Navbar, Product, Header, Comment, Dashboard };
