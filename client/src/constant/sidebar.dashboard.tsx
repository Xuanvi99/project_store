import { IconSidebarDashboard } from "../components/icon";

const size = 25;
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
      {
        title: "Khôi Phục Sản Phẩm",
        path: "/dashboard/product/restore",
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
    icon: <IconSidebarDashboard.Inventory size={size} />,
    title: "Quản lý Kho Hàng",
    path: "/dashboard/inventory",
    children: [],
  },
  {
    icon: <IconSidebarDashboard.Comment size={size} />,
    title: "Bình Luận",
    path: "/dashboard/comment",
    children: [],
  },
  {
    icon: <IconSidebarDashboard.Message size={size} />,
    title: "Tin Nhắn",
    path: "/dashboard/message",
    children: [],
  },
];

export { listNavBarItem };
