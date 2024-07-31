import { IconDelete } from "@/components/icon";
import { Input } from "@/components/input";
import { IProductRes } from "@/types/product.type";
import { cn, formatPrice } from "@/utils";
import IconEye from "../../../../../components/icon/IconEye";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ModalDeleteProduct from "./ModalDeleteProduct";
import { useDeleteOneProductMutation } from "@/stores/service/product.service";
import { useAppSelector, useToggle } from "@/hook";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import { Fragment } from "react";

type TProps = {
  data: IProductRes;
  index: number;
  isChecked: boolean;
  handleCheckOneProduct: (checked: boolean, id: string) => void;
};

function ProductItem({
  data,
  index,
  isChecked,
  handleCheckOneProduct,
}: TProps) {
  const {
    thumbnail,
    name,
    status,
    categoryId,
    price,
    sold,
    is_sale,
    priceSale,
    inventoryId,
    _id,
  } = data;

  const user = useAppSelector((state: RootState) => state.authSlice.user);

  const { toggle: openModal, handleToggle: handleOpenModal } = useToggle();

  const [DeleteOneProduct] = useDeleteOneProductMutation();

  const handleDeleteOneProduct = async () => {
    if (user) {
      await DeleteOneProduct({ productId: _id, userId: user._id })
        .unwrap()
        .then(() => {
          toast("Xóa sản phẩm thành công", { type: "success" });
          handleCheckOneProduct(false, _id);
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
      <div
        className={cn(
          "productItem grid w-full grid-cols-[50px_350px_100px_100px_100px_100px_100px_auto] text-sm grid-rows-1 ",
          index % 2 !== 0 ? "bg-grayFa" : ""
        )}
      >
        <span className="flex items-center justify-center">
          <Input
            type="checkbox"
            name="checkbox"
            data-id={""}
            className={{
              input: "w-5 h-5 cursor-pointer",
              wrap: "w-5 static",
            }}
            onChange={() => {
              handleCheckOneProduct(!isChecked, _id);
            }}
            checked={isChecked}
          />
        </span>
        <div className="flex items-center justify-start w-full text-xs font-semibold text-grayDark gap-x-1">
          <LazyLoadImage
            alt="Thumbnails"
            placeholderSrc={thumbnail.url}
            srcSet={thumbnail.url}
            effect="blur"
            className="min-w-[50px] h-[50px]"
          />
          <p className="p-2 line-clamp-2">{name}</p>
        </div>
        <span className="font-semibold">{categoryId.name}</span>
        <span className="text-danger">
          {formatPrice(is_sale ? priceSale : price)}₫
        </span>
        <span>{inventoryId.total}</span>
        <span>{sold}</span>
        <span>{handleFormatStatusProduct(status)}</span>
        <span className="flex items-center justify-center gap-x-2">
          <IconEye
            isOpenEye={true}
            size={20}
            className="cursor-pointer hover:text-orange"
          ></IconEye>
          <div className="w-[1px] h-1/2 bg-gray"></div>
          <IconDelete size={20} onClick={handleOpenModal}></IconDelete>
        </span>
      </div>
    </Fragment>
  );
}

export default ProductItem;
