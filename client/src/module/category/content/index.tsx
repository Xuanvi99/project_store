import { ProductLoadMore } from "@/components/product";
import Filter from "./Filter";

function Content() {
  return (
    <main className="product-search">
      <Filter></Filter>
      <ProductLoadMore></ProductLoadMore>;
    </main>
  );
}

export default Content;
