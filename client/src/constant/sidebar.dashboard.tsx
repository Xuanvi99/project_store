import { IconSidebarDashboard } from "../components/icon";

const size = 20;
const listNavBarItem = [
  {
    icon: <IconSidebarDashboard.Dashboard size={size} />,
    title: "Tổng Quát",
    path: "/dashboard/home",
  },
  {
    icon: <IconSidebarDashboard.Product size={size} />,
    title: "Sản Phẩm",
    path: "/dashboard/product",
    children: [],
  },
  {
    icon: <IconSidebarDashboard.Purchase size={size} />,
    title: "Đơn Hàng",
    path: "/dashboard/order/home",
  },
  {
    icon: <IconSidebarDashboard.Comment size={size} />,
    title: "Bình Luận",
    path: "/dashboard/comment",
  },
];

export { listNavBarItem };
