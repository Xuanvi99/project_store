import { IconNavBar } from "../components/icon";

const size = 20;
const listNavBarItem = [
  {
    icon: <IconNavBar.Dashboard size={size} />,
    title: "Tổng Quát",
    path: "/dashboard/home",
  },
  {
    icon: <IconNavBar.product size={size} />,
    title: "Sản Phẩm",
    path: "/dashboard/product",
  },
  {
    icon: <IconNavBar.comment size={size} />,
    title: "Bình Luận",
    path: "/dashboard/comment",
  },
];

export { listNavBarItem };
