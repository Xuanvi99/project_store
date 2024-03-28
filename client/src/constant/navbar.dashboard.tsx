import { IconNavBar } from "../components/icon";

const size = 30;
const listNavBarItem = [
  {
    icon: <IconNavBar.Dashboard size={size} />,
    title: "Sản phẩm",
    path: "/dashboard/home",
  },
  {
    icon: <IconNavBar.product size={size} />,
    title: "Sản phẩm",
    path: "/dashboard/product",
  },
  {
    icon: <IconNavBar.comment size={size} />,
    title: "Bình Luận",
    path: "/dashboard/comment",
  },
];

export { listNavBarItem };
