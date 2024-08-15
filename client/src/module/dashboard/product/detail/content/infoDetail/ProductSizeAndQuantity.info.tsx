import useTestContext from "@/hook/useTestContext";
import { DetailProductContext, IDetailProductProvide } from "../../context";
import { cn } from "@/utils";

function ProductSizeAndQuantity() {
  const { listProductItem } = useTestContext<IDetailProductProvide>(
    DetailProductContext as React.Context<IDetailProductProvide>
  );
  return (
    <div className="flex flex-col mt-5 gap-y-3">
      <span className="text-sm font-semibold">Chi tiết Size - Số lượng:</span>
      <table
        className={cn(
          "font-semibold table-auto mx-auto w-[400px]",
          "[&>thead]:bg-gray98 [&>thead]:text-white"
        )}
      >
        <thead>
          <tr>
            <th className="py-2 text-center">Size</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {listProductItem &&
            listProductItem.length > 0 &&
            listProductItem.map((item, index) => {
              return (
                <tr
                  key={index}
                  className={index % 2 !== 0 ? "bg-slate-200" : "bg-grayF5"}
                >
                  <td className="py-2 text-center">{item.size}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductSizeAndQuantity;
