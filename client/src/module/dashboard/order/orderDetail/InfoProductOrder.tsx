import { IResOrder, TProductOrderItem } from "@/types/order.type";
import { IProductRes } from "@/types/product.type";
import { formatPrice } from "@/utils";

type TProps = {
  data: IResOrder;
};
function InfoProductOrder({ data }: TProps) {
  const { listProducts } = data;

  return (
    <div className="w-full mt-10">
      <h1 className="my-5 font-semibold">Thông tin sản phẩm đặt hàng</h1>
      <div className="flex w-full gap-x-5">
        <div className="basis-2/3">
          <table className="table w-full border-collapse table_product caption-bottom ">
            <thead className="text-sm bg-light">
              <tr>
                <th className="w-[350px] text-start">Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng cộng</th>
              </tr>
            </thead>
            <tbody className="min-h-[300px] overflow-y-scroll">
              {listProducts &&
                listProducts.length > 0 &&
                listProducts.map((product: TProductOrderItem<IProductRes>) => {
                  return (
                    <tr key={product._id} className="tr_product">
                      <td className="w-[350px] text-start flex text-sm gap-x-2 items-center">
                        <img
                          alt="sản phẩm-img"
                          srcSet={product.productId.thumbnail.url}
                          width={40}
                          height={40}
                        />
                        <div className="flex flex-col justify-start text-start">
                          <span className="font-semibold line-clamp-1">
                            {product.productId.name}
                          </span>
                          <span>size: {product.size}</span>
                        </div>
                      </td>
                      <td>{product.quantity}</td>
                      <td className="text-danger">
                        {formatPrice(
                          product.priceSale > 0
                            ? product.priceSale
                            : product.price
                        )}
                        ₫
                      </td>
                      <td className="text-danger">
                        {formatPrice(
                          product.quantity * product.priceSale > 0
                            ? product.priceSale
                            : product.price
                        )}
                        ₫
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="basis-1/3">
          <table className="table w-full border-collapse table_product caption-bottom basis-1/3">
            <thead className="text-sm bg-light">
              <tr>
                <th className="text-start" colSpan={2}>
                  Thông tin thanh toán đơn hàng
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm font-semibold">Tiền hàng:</td>
                <td className="text-danger">{formatPrice(data.subTotal)}₫</td>
              </tr>
              <tr>
                <td className="text-sm font-semibold">Phí vận chuyển</td>
                <td className="flex text-danger">
                  {formatPrice(data.shippingFee)}₫
                </td>
              </tr>
              <tr>
                <td className="text-sm font-semibold">Tổng cộng:</td>
                <td className="text-danger">{formatPrice(data.total)}₫</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InfoProductOrder;
