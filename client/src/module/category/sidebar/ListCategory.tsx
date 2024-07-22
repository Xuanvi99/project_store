import useTestContext from "@/hook/useTestContext";
import { useGetAllCategoryQuery } from "@/stores/service/category.service";
import { ICategory } from "@/types/category.type";
import { cn } from "@/utils";
import { useNavigate } from "react-router-dom";
import { CategoryContext, ICategoryProvide } from "../context";

function ListCategory() {
  const { data: resCategory } = useGetAllCategoryQuery();

  return (
    <div className="flex flex-col">
      <Heading title="Danh mục sản phẩm" className="rounded-t-md" />
      <ul className="flex flex-col w-full p-3 bg-white gap-y-5 rounded-b-md">
        {resCategory &&
          resCategory.data.length > 0 &&
          resCategory.data.map((item) => {
            return <CategoryItem key={item._id} data={item}></CategoryItem>;
          })}
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

const CategoryItem = ({ data }: { data: ICategory }) => {
  const navigate = useNavigate();
  const { name, productIds } = data;

  const { handleSetFilter, handleSetData } = useTestContext<ICategoryProvide>(
    CategoryContext as React.Context<ICategoryProvide>
  );

  const handleClickCategory = () => {
    if (productIds.length > 0) {
      handleSetFilter({
        activePage: 1,
        search: name.toLowerCase(),
        order: "",
        sortBy: "relevancy",
        min_price: 0,
        max_price: 0,
      });
      handleSetData({
        listProduct: [],
        totalPage: 0,
        amount_filter: 0,
        result_search: [],
      });
      navigate(`/category/${name.toLowerCase()}?page=1`);
    }
  };

  return (
    <li
      className="p-2 cursor-pointer font-semibold flex items-center border-b-[1px] border-slate-300 gap-x-1 hover:text-orange"
      onClick={handleClickCategory}
    >
      <span>{name}</span>
      <span className="text-sm text-grayCa">({productIds.length})</span>
    </li>
  );
};

export default ListCategory;
