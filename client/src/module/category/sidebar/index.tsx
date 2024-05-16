import PriceFilter from "./PriceFilter";
import ListCategory from "./ListCategory";

function Sidebar() {
  return (
    <aside className="w-full">
      <Sidebar.ListCategory></Sidebar.ListCategory>
      <Sidebar.PriceFilter></Sidebar.PriceFilter>
    </aside>
  );
}

Sidebar.ListCategory = ListCategory;
Sidebar.PriceFilter = PriceFilter;

export default Sidebar;
