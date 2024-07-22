import { Dropdown } from "@/components/dropdown";
import { IconChevronLeft, IconChevronRight } from "@/components/icon";
import { optionLimit } from "@/constant/category.constant";
import { paramsFilterProduct, TParams } from "@/types/product.type";
import ReactPaginate from "react-paginate";

type TProps = {
  totalPage: number;
  filter: paramsFilterProduct;
  handleSetFilter: (value: TParams<paramsFilterProduct>) => void;
};

function PaginationProduct({ totalPage, filter, handleSetFilter }: TProps) {
  return (
    <div className="flex items-center justify-between w-full p-3 bg-slate-100 border-t-1 border-t-grayCa">
      <div className="flex justify-start basis-1/2">
        {totalPage > 1 && (
          <ReactPaginate
            breakLabel="..."
            nextLabel={<IconChevronRight size={12}></IconChevronRight>}
            onPageChange={(selectedItem) => {
              handleSetFilter({ activePage: selectedItem.selected + 1 });
            }}
            pageRangeDisplayed={5}
            pageCount={totalPage}
            previousLabel={<IconChevronLeft size={12}></IconChevronLeft>}
            renderOnZeroPageCount={null}
            className="flex items-center text-sm gap-x-2"
            pageClassName="py-[6px] px-3"
            previousClassName={`${totalPage === 1 && "hidden"}`}
            nextClassName={`${totalPage === 1 && "hidden"}`}
            activeClassName="bg-orangeFe flex justify-center items-center rounded-full text-white text-sm font-semibold"
          />
        )}
      </div>
      <div className="flex items-center justify-end text-sm font-semibold basis-1/2 text-gray98 text-end gap-x-2">
        <span>Hiện thị</span>
        <Dropdown
          className={{
            wrap: "min-w-[70px]",
            select: "h-full rounded-md text-dark",
            option: "min-w-[50px]",
          }}
          title="10"
          value={"" + filter.limit}
          options={optionLimit}
          handleSelect={(option) => {
            handleSetFilter({ limit: +option.value });
          }}
        />
        <span>/10</span>
      </div>
    </div>
  );
}

export default PaginationProduct;
