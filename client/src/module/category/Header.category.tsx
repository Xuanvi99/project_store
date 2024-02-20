import { Dropdown } from "../../components/dropdown";
import { OptionSearch } from "../../constant/category.constant";

function Header() {
  return (
    <div className="flex items-center justify-between w-full my-5">
      <div className="flex items-center font-bold gap-x-2">
        <span className="text-orange">Từ khóa tìm kiếm:</span>
        <span className="max-w-[400px] line-clamp-1">abc</span>
      </div>
      <Dropdown title="Độ liên quan" options={OptionSearch}></Dropdown>
    </div>
  );
}

export default Header;
