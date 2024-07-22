import { IconSidebarDashboard } from "../components/icon";

const size = 20;
const listNavBarItem = [
  {
    icon: <IconSidebarDashboard.Dashboard size={size} />,
    title: "Tổng Quát",
    path: "/dashboard/home",
    children: [],
  },
  {
    icon: <IconSidebarDashboard.Product size={size} />,
    title: "Quản lý Sản Phẩm",
    path: "/dashboard/product",
    children: [
      { title: "Danh Sách Sản Phẩm", path: "/dashboard/product/list" },
      {
        title: "Thêm Sản Phẩm",
        path: "/dashboard/product/create",
      },
    ],
  },
  {
    icon: <IconSidebarDashboard.Purchase size={size} />,
    title: "Quản lý Đơn Hàng",
    path: "/dashboard/order",
    children: [
      { title: "Tổng Hợp Đơn Hàng", path: "/dashboard/order/home" },
      {
        title: "In/Xuất Đơn Hàng",
        path: "/dashboard/order/print",
      },
    ],
  },
  {
    icon: <IconSidebarDashboard.Comment size={size} />,
    title: "Bình Luận",
    path: "/dashboard/comment",
    children: [],
  },
];

export { listNavBarItem };
