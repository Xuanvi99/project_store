import { Input } from "@/components/input";
import { IResProductDeleted } from "@/types/product.type";
import { cn } from "@/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useToggle } from "@/hook";
import { Fragment } from "react";
import { toast } from "react-toastify";
import ModalRestoreProduct from "./ModalRestoreProduct";
import { useRestoreOneProductMutation } from "@/stores/service/product.service";

type TProps = {
  data: IResProductDeleted;
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
  const { thumbnail, name, categoryId, _id, deletedBy, deletedAt } = data;

  const { toggle: openModal, handleToggle: handleOpenModal } = useToggle();

  const [restoreOneProduct] = useRestoreOneProductMutation();

  const handleRestoreOneProduct = async () => {
    await restoreOneProduct(_id)
      .unwrap()
      .then(() => {
        toast("Khôi phục sản phẩm thành công", { type: "success" });
        handleCheckOneProduct(false, _id);
      })
      .catch(() => {
        toast("Khôi phục sản phẩm thất bại", { type: "error" });
      })
      .finally(() => {
        handleOpenModal();
      });
  };

  return (
    <Fragment>
      <ModalRestoreProduct
        openModal={openModal}
        handleOpenModal={handleOpenModal}
        handleRestoreProduct={handleRestoreOneProduct}
      ></ModalRestoreProduct>
      <div
        className={cn(
          "productItem grid w-full grid-cols-[50px_350px_100px_150px_150px_100px_auto] text-sm grid-rows-1 ",
          "[&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:p-3",
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
        <span className="flex items-center justify-start text-xs font-semibold w-fit text-grayDark gap-x-1">
          <LazyLoadImage
            alt="Thumbnails"
            placeholderSrc={thumbnail.url}
            srcSet={thumbnail.url}
            effect="blur"
            className="min-w-[50px] h-[50px]"
          />
          <p className="p-2 line-clamp-2">{name}</p>
        </span>
        <span className="font-semibold">{categoryId.name}</span>
        <span>{new Date(deletedAt).toLocaleString()}</span>
        <span>{deletedBy.userName}</span>
        <span>{deletedBy.role}</span>
        <span
          onClick={handleOpenModal}
          className="font-semibold cursor-pointer text-blue hover:text-orange hover:underline"
        >
          Khôi phục
        </span>
      </div>
    </Fragment>
  );
}

export default ProductItem;
