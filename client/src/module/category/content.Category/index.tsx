import { Header } from "..";
import { ProductLoadMore } from "../../../components/product";

function Content() {
  return (
    <main className="product-search">
      <Header></Header>
      <ProductLoadMore name="sale"></ProductLoadMore>;
    </main>
  );
}

export default Content;
