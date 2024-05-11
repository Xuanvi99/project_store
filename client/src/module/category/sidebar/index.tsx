import PriceFilter from "./PriceFilter";
import ProductFilter from "./ProductFilter";

function Sidebar() {
  return (
    <aside className="w-full">
      <Sidebar.ProductFilter></Sidebar.ProductFilter>
      <Sidebar.PriceFilter
        price={{ start: 10, end: 1000 }}
      ></Sidebar.PriceFilter>
    </aside>
  );
}

Sidebar.ProductFilter = ProductFilter;
Sidebar.PriceFilter = PriceFilter;

export default Sidebar;
