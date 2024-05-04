import { useGetAllCategoryQuery } from "@/stores/service/category.service";
import { useGetListProductQuery } from "@/stores/service/product.service";
import { ICategory } from "@/types/category.type";
import { cn } from "@/utils";
import { useNavigate } from "react-router-dom";

function ProductFilter() {
  const { data: resCategory } = useGetAllCategoryQuery();

  const { data: resProduct } = useGetListProductQuery({
    search: "",
    activePage: 1,
    limit: 0,
  });
  return (
    <div className="flex flex-col">
      <Heading title="Danh mục sản phẩm" className="rounded-t-md" />
      <ul className="flex flex-col w-full p-3 bg-white gap-y-5 rounded-b-md">
        {resCategory &&
          resCategory.data.length > 0 &&
          resCategory.data.map((item) => {
            return <FilterItem key={item._id} data={item}></FilterItem>;
          })}
        <li className="p-2 cursor-pointer font-semibold flex items-center border-b-[1px] border-slate-300 gap-x-1 hover:text-orange ">
          <span>Tổng</span>
          <span className="text-gray text-sm">({resProduct?.data.length})</span>
        </li>
      </ul>
    </div>
  );
}

const Heading = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "inline-block w-full bg-orangeLinear p-2 text-lg font-bold text-white",
        className
      )}
    >
      {title}
    </h3>
  );
};

const FilterItem = ({ data }: { data: ICategory }) => {
  const navigate = useNavigate();
  const { name, productIds } = data;

  const handleSubmitSearch = () => {
    const search = name === "Flash sale" ? "flashSale" : name;
    navigate(`/category?search=${search}`);
  };

  return (
    <li className="p-2 cursor-pointer font-semibold flex items-center border-b-[1px] border-slate-300 gap-x-1 hover:text-orange">
      <span onClick={handleSubmitSearch}>{name}</span>
      <span className="text-gray text-sm">({productIds.length})</span>
    </li>
  );
};

export default ProductFilter;
