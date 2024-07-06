import Content from "./content";
import { ListOrderProvide } from "./context";
import FilterOrder from "./filter";

function ListOrder() {
  return (
    <ListOrderProvide>
      <div className="mt-7">
        <FilterOrder></FilterOrder>
        <Content></Content>
      </div>
    </ListOrderProvide>
  );
}

export default ListOrder;
