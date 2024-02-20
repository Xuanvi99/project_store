import { productCategory } from "../../../constant/category.constant";
import { cn } from "../../../utils";

function ProductFilter() {
  return (
    <div className="flex flex-col">
      <Heading title="Danh mục sản phẩm" className="rounded-t-md" />
      <ul className=" flex flex-col gap-y-5 w-full bg-white p-3 rounded-b-md">
        {productCategory &&
          productCategory.length > 0 &&
          productCategory.map((text) => {
            return <FilterItem key={text} text={text} current={0}></FilterItem>;
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

const FilterItem = ({
  text,
  current = 0,
}: {
  text: string;
  current: number;
}) => {
  return (
    <li className="p-2 cursor-pointer font-semibold flex items-center border-b-[1px] border-slate-300 gap-x-1 hover:text-orange ">
      <span>{text}</span>
      <span className="text-gray">({current})</span>
    </li>
  );
};

export default ProductFilter;
