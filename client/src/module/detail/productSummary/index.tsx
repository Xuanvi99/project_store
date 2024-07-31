import useTestContext from "@/hook/useTestContext";
import { IProductDetailProvide, PDetailContext } from "../context";

function ProductSummary() {
  const { listProductItem } = useTestContext<IProductDetailProvide>(
    PDetailContext as React.Context<IProductDetailProvide>
  );
  return (
    <section className="w-full mt-5 bg-white rounded-md py-5 px-[10px]">
      <h1 className="text-lg font-bold">THÔNG SỐ SẢN PHẨM</h1>
      <div className="flex w-full px-10 mt-5 overflow-hidden">
        <table className="border-none bg-light">
          <tbody>
            <tr className="">
              <th className="w-[300px] leading-8 h-8 text-left p-2">Size</th>
              <td className="w-[calc(100vw-300px)] bg-white p-3 text-sm">
                {listProductItem?.map((item, index) => {
                  return (
                    <span key={index} className="ml-1">
                      {item.size},
                    </span>
                  );
                })}
              </td>
            </tr>
            <tr className="">
              <th className="w-[300px] leading-8 h-8 text-left p-2">
                Thương hiệu
              </th>
              <td className="w-[calc(100vw-300px)] bg-white p-3 text-sm">
                <p>Nike</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProductSummary;
