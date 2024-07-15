import { Link, useParams } from "react-router-dom";
import { IconChevronRight } from "@/components/icon";

function Header() {
  const { slug } = useParams();
  const handleSlugOrder = (slug: string) => {
    switch (slug) {
      case "home":
        return "Đơn hàng";

      case "detail":
        return "Chi tiết đơn hàng";

      default:
        break;
    }
  };
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white border-b-1 border-b-grayCa">
      <h1 className="text-2xl font-semibold">{handleSlugOrder(slug || "")}</h1>
      {slug && slug !== "home" && (
        <div className="text-sm text-gray flex items-center gap-x-1">
          <Link
            to="/dashboard/order/home"
            className="font-semibold hover:text-blue hover:underline"
          >
            Đơn hàng
          </Link>
          <span>
            <IconChevronRight size={10}></IconChevronRight>
          </span>
          <span>{handleSlugOrder(slug || "")}</span>
        </div>
      )}
    </header>
  );
}

export default Header;
