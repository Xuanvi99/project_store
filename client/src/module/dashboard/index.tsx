import Sidebar from "./sidebar";
import { HeaderDashboard } from "./header";
import * as Product from "./product";
import * as Order from "./order";
import Home from "./home";
import Chat from "./chat";
import Comment from "./comment";
import Inventory from "./inventory";

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-[calc(100vh-80px)] main-page">
      <HeaderDashboard></HeaderDashboard>
      <section className="pt-[60px] min-h-full ml-auto w-[calc(100%-250px)]">
        {children}
      </section>
    </main>
  );
};

export { Sidebar, Main, Home, Product, Order, Chat, Comment, Inventory };
