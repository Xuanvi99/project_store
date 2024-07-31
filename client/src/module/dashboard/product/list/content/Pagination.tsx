import { IconChevronLeft, IconChevronRight } from "@/components/icon";
import useTestContext from "@/hook/useTestContext";
import ReactPaginate from "react-paginate";
import { IListPdProvide, ListPdContext } from "../context";
import { Input } from "@/components/input";
import { useDeleteMultipleProductMutation } from "@/stores/service/product.service";
import { useAppSelector, useToggle } from "@/hook";
import { RootState } from "@/stores";
import { toast } from "react-toastify";
import ModalDeleteProduct from "./ModalDeleteProduct";
import { Fragment } from "react";

function PaginationListProduct() {
  const {
    data,
    handleSetFilter,
    handleCheckAllProduct,
    listSelectProductId,
    setListSelectProductId,
  } = useTestContext<IListPdProvide>(
    ListPdContext as React.Context<IListPdProvide>
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
      <div className="flex items-center justify-between w-full p-4 bg-slate-100 border-t-1 border-t-grayCa">
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
            className="text-sm cursor-pointer text-danger font-semibold hover:text-orange hover:underline "
          >
            Xoá sản phẩm ({listSelectProductId.length})
          </span>
        </div>
        <div className="flex justify-end basis-1/2">
          {data.totalPage > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel={<IconChevronRight size={15}></IconChevronRight>}
              onPageChange={(selectedItem) => {
                handleSetFilter({ activePage: selectedItem.selected + 1 });
                setListSelectProductId([]);
              }}
              pageRangeDisplayed={5}
              pageCount={data.totalPage}
              previousLabel={<IconChevronLeft size={15}></IconChevronLeft>}
              renderOnZeroPageCount={null}
              className="flex items-center text-sm gap-x-1"
              pageClassName="py-[6px] px-3"
              previousClassName={`${
                data.totalPage === 1 && "hidden"
              } hover:text-orange`}
              nextClassName={`${
                data.totalPage === 1 && "hidden"
              }  hover:text-orange`}
              activeClassName="bg-orangeFe flex justify-center items-center rounded-full text-white text-sm font-semibold"
            />
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default PaginationListProduct;
