import { cn } from "@/utils";
import { useSearchParams } from "react-router-dom";

const listHeaderItem = [
  "Tất cả",
  "Vận chuyển",
  "Chờ giao hàng",
  "Hoàn thành",
  "Đã hủy",
  "Trả hàng/Hoàn tiền",
];

function HeaderPurchase({
  type,
  handleSelectType,
}: {
  type: number;
  handleSelectType: (type: number) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <header className="grid grid-flow-row grid-cols-6 bg-white rounded-sm">
      {listHeaderItem.map((item, index) => {
        if (type && type <= listHeaderItem.length) {
          return (
            <NavItem
              key={index}
              title={item}
              activeItem={type === index + 1 ? true : false}
              onClick={() => {
                const type = index + 1;
                searchParams.set("type", type.toString());
                setSearchParams(searchParams);
                handleSelectType(type);
              }}
            ></NavItem>
          );
        } else {
          return (
            <NavItem
              key={index}
              title={item}
              activeItem={index + 1 === 1 ? true : false}
              onClick={() => {
                const type = index + 1;
                searchParams.set("type", type.toString());
                setSearchParams(searchParams);
                handleSelectType(type);
              }}
            ></NavItem>
          );
        }
      })}
    </header>
  );
}

const NavItem = ({
  title,
  activeItem,
  onClick,
}: {
  title: string;
  activeItem: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        ` py-4 text-center cursor-pointer`,
        activeItem && "text-orange border-b-2 border-b-orange"
      )}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default HeaderPurchase;
