import Gallery from "./Gallery";
import InfoShoes from "./InfoShoes";
import Sidebar from "./Sidebar.product";

function ProductSingle() {
  return (
    <section className="flex justify-between w-full bg-white gap-x-5 py-5 px-[10px] mt-10">
      <ProductSingle.Gallery></ProductSingle.Gallery>
      <ProductSingle.InfoShoes type="sale"></ProductSingle.InfoShoes>
      <ProductSingle.Sidebar></ProductSingle.Sidebar>
    </section>
  );
}

ProductSingle.Gallery = Gallery;
ProductSingle.InfoShoes = InfoShoes;
ProductSingle.Sidebar = Sidebar;

export default ProductSingle;
