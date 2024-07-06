import { cn } from "@/utils";
import ProductItem from "./ProductItem.purchase";
import { IResOrder } from "@/types/order.type";

function ListProduct({ data }: { data: IResOrder["listProducts"] }) {
  return (
    <div
      className={cn(
        "border-dashed border-b-1 border-b-grayCa gap-y-2",
        data.length > 4 && "overflow-y-scroll max-h-[348px]"
      )}
    >
      {data &&
        data.map((product) => {
          return <ProductItem key={product._id} data={product}></ProductItem>;
        })}
    </div>
  );
}

export default ListProduct;
