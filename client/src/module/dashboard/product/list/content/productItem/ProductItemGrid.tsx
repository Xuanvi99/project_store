import { IconDelete } from "@/components/icon";
import { IProductRes } from "@/types/product.type";
import { cn, formatPrice } from "@/utils";
import IconEye from "../../../../../../components/icon/IconEye";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ModalDeleteProduct from "../ModalDeleteProduct";
import { useDeleteOneProductMutation } from "@/stores/service/product.service";
import { useAppSelector, useToggle } from "@/hook";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";

type TProps = {
  product: IProductRes;
};

function ProductItemGrid({ product }: TProps) {
  const {
    thumbnail,
    name,
    status,
    price,
    sold,
    is_sale,
    priceSale,
    inventoryId,
    _id,
  } = product;

  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const { toggle: openModal, handleToggle: handleOpenModal } = useToggle();

  const [DeleteOneProduct] = useDeleteOneProductMutation();

  const handleDeleteOneProduct = async () => {
    if (user) {
      await DeleteOneProduct({ productId: _id, userId: user._id })
        .unwrap()
        .then(() => {
          toast("Xóa sản phẩm thành công", { type: "success" });
        })
        .catch(() => {
          toast("Xóa sản phẩm thất bại", { type: "error" });
        })
        .finally(() => {
          handleOpenModal();
        });
    }
  };

  const handleFormatStatusProduct = (value: string) => {
    switch (value) {
      case "inactive":
        return (
          <p className="inline p-1 text-xs font-semibold text-red-500 bg-red-100 rounded-xs">
            Ngừng bán
          </p>
        );

      case "active":
        return (
          <p className="inline p-1 text-xs font-semibold rounded-sm text-emerald-500 bg-emerald-100">
            Đang bán
          </p>
        );

      default:
        break;
    }
  };

  return (
    <Fragment>
      <ModalDeleteProduct
        openModal={openModal}
        handleOpenModal={handleOpenModal}
        handleDeleteProduct={handleDeleteOneProduct}
      ></ModalDeleteProduct>
      <div className="relative flex flex-col overflow-hidden rounded-md group productItem_grid shadow-shadow2">
        <div className="w-[calc(960px/4)] h-[240px] p-4">
          <LazyLoadImage
            alt="Thumbnails"
            placeholderSrc={thumbnail.url}
            srcSet={thumbnail.url}
            effect="blur"
            className="object-cover rounded-sm"
          />
        </div>
        <div className="z-40 flex flex-col p-3 text-sm bg-white border-t-1 border-t-grayCa gap-y-2">
          <p className="font-semibold line-clamp-2">{name}</p>
          <div className="flex items-center gap-x-1">
            <span>Giá bán:</span>
            <span
              className={
                is_sale
                  ? "line-through text-xs text-grayCa"
                  : "font-semibold text-red-600"
              }
            >
              {formatPrice(price)}₫
            </span>
            {is_sale && (
              <span className="font-semibold text-red-600">
                {formatPrice(priceSale)}₫
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-1">
              <span>Số lượng:</span>
              <span className="font-semibold">{inventoryId.total}</span>
            </div>
            <div className="flex items-center gap-x-1">
              <span>Đá bán:</span>
              <span className="font-semibold">{sold}</span>
            </div>
          </div>
          <div className="flex items-center gap-x-1">
            <span>Trạng thái:</span>
            <span>{handleFormatStatusProduct(status)}</span>
          </div>
        </div>
        <div
          className={cn(
            "absolute z-30 -translate-x-1/2 left-1/2 top-2/3",
            "flex items-center justify-center text-sm gap-x-5 transition-all group/iconDelete",
            "group-hover:top-1/2 "
          )}
        >
          <Button
            variant="outLine-flex"
            type="button"
            className="px-3 py-1"
            onClick={() => {
              navigate(`/dashboard/product/detail/${_id}`);
            }}
          >
            <IconEye isOpenEye={true} size={14}></IconEye>
            <p>Xem</p>
          </Button>
          <Button
            variant="outLine-flex"
            type="button"
            className="px-3 py-1"
            onClick={handleOpenModal}
          >
            <IconDelete size={14}></IconDelete>
            <p>Xóa</p>
          </Button>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductItemGrid;
