import { IconAlert, IconShoppingFee } from "@/components/icon";
import Tooltip from "@/components/tooltip";
import { listHeaderOrder } from "@/constant/order.constant";

function HeaderPurchase({
  id,
  statusOrder,
}: {
  id: string;
  statusOrder: string;
}) {
  const titleStatusOrder = (statusOrder: string) => {
    const indexItem = listHeaderOrder.findIndex(
      (order) => order.status === statusOrder
    );
    return listHeaderOrder[indexItem].title;
  };

  return (
    <div className="flex items-center justify-between border-dashed border-b-1 border-b-grayCa">
      <h1 className="py-3 text-xl font-semibold">
        + Đơn hàng của bạn{" "}
        <span className="text-xs font-normal">( id:{id} )</span>
      </h1>
      <div>
        {statusOrder === "completed" && (
          <>
            <div className="flex items-center text-xs gap-x-1 text-green ">
              <IconShoppingFee size={20}></IconShoppingFee>
              <div className="flex">
                <span>Giao hàng thành công</span>
                <Tooltip
                  place="bottom"
                  select={<IconAlert size={15}></IconAlert>}
                  className={{
                    select: "z-40 text-gray",
                    content: "-translate-x-3/4",
                  }}
                >
                  <div className="min-w-[150px] h-10 text-xs text-center">
                    Phí vận chuyển được miễn phí khi mua 2 đôi trở lên
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="bg-grayCa w-[1px] h-[20px]"></div>
          </>
        )}
        <span className=" text-danger">{titleStatusOrder(statusOrder)}</span>
      </div>
    </div>
  );
}

export default HeaderPurchase;
