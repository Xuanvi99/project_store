import { ProductLoadMore } from "@/components/product";
import { Header } from "..";

function Content() {
  return (
    <main className="product-search">
      <Header></Header>
      <ProductLoadMore name="sale"></ProductLoadMore>;
    </main>
  );
}

export default Content;
