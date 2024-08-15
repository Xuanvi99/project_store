import { IconChevronLeft, IconChevronRight } from "@/components/icon";
import useTestContext from "@/hook/useTestContext";
import ReactPaginate from "react-paginate";
import { IListProductProvide, ListProductContext } from "../context";
import { Input } from "@/components/input";
import { useDeleteMultipleProductMutation } from "@/stores/service/product.service";
import { useAppSelector, useToggle } from "@/hook";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import ModalDeleteProduct from "./ModalDeleteProduct";
import { Fragment } from "react";
import { cn } from "@/utils";

function PaginationListProduct() {
  const {
    data,
    filter,
    showProduct,
    handleSetFilter,
    handleCheckAllProduct,
    listSelectProductId,
    setListSelectProductId,
    scrollTop,
  } = useTestContext<IListProductProvide>(
    ListProductContext as React.Context<IListProductProvide>
  );

  const user = useAppSelector((state: RootState) => state.authSlice.user);
  const { toggle: openModal, handleToggle: handleOpenModal } = useToggle();

  const [deleteMultipleProduct] = useDeleteMultipleProductMutation();

  const handleDeleteMultipleProduct = async () => {
    if (user && listSelectProductId.length > 0) {
      await deleteMultipleProduct({
        listProductId: listSelectProductId,
        userId: user._id,
      })
        .unwrap()
        .then(() => {
          toast(`Xóa ${listSelectProductId.length} sản phẩm thành công`, {
            type: "success",
          });
          setListSelectProductId([]);
        })
        .catch(() => {
          toast(`Xóa ${listSelectProductId.length} sản phẩm thất bại`, {
            type: "error",
          });
        })
        .finally(() => {
          handleOpenModal();
        });
    }
  };

  return (
    <Fragment>
      <ModalDeleteProduct
        openModal={openModal}
        handleOpenModal={handleOpenModal}
        handleDeleteProduct={handleDeleteMultipleProduct}
      ></ModalDeleteProduct>
      <div
        className={cn(
          "w-full flex items-center justify-between p-4 bg-slate-100 border-t-1 border-t-grayCa",
          showProduct === "grid" && "justify-end bg-white border-none"
        )}
      >
        {showProduct === "list" && (
          <div className="flex items-center justify-start basis-1/2 gap-x-5">
            <Input
              type="checkbox"
              name="checkAll"
              className={{
                input: "w-5 h-5 cursor-pointer",
                wrap: "w-5 static",
              }}
              onChange={(event) => {
                handleCheckAllProduct(event.target.checked);
              }}
              checked={
                listSelectProductId.length === data.listProduct.length
                  ? true
                  : false
              }
            />
            <span
              onClick={handleOpenModal}
              className="text-sm font-semibold cursor-pointer text-danger hover:text-orange hover:underline "
            >
              Xoá sản phẩm ({listSelectProductId.length})
            </span>
          </div>
        )}
        <div className="flex justify-end basis-1/2">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<IconChevronRight size={15}></IconChevronRight>}
            initialPage={filter.activePage - 1}
            onPageChange={(selectedItem) => {
              handleSetFilter({ activePage: selectedItem.selected + 1 });
              setListSelectProductId([]);
              window.scrollTo({ behavior: "smooth", top: scrollTop });
            }}
            pageRangeDisplayed={5}
            pageCount={data.totalPage}
            previousLabel={<IconChevronLeft size={15}></IconChevronLeft>}
            renderOnZeroPageCount={null}
            className="flex items-center text-sm gap-x-1"
            pageClassName="py-[6px] px-3"
            previousClassName={`${
              filter.activePage === 1 && "hidden"
            } hover:text-orange`}
            nextClassName={`${
              data.totalPage === filter.activePage && "hidden"
            }  hover:text-orange`}
            activeClassName="bg-orangeFe flex justify-center items-center rounded-full text-white text-sm font-semibold"
          />
        </div>
      </div>
    </Fragment>
  );
}

export default PaginationListProduct;
