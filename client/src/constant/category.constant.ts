import { paramsFilterProduct } from "@/types/product.type";

export const productCategory = [
  { id: "1", label: "Flash sale", value: "Flash sale" },
  { id: "2", label: "Nike", value: "Nike" },
  { id: "3", label: "Adidas", value: "Adidas" },
  { id: "4", label: "Vans", value: "Vans" },
  { id: "5", label: "Converse", value: "Converse" },
];

export const OptionPrice = [
  { id: "1", label: "Giá thấp đến cao", value: "asc" },
  { id: "2", label: "Giá cao đến thấp", value: "desc" },
];

export const OptionSearch: {
  id: string;
  label: string;
  value: paramsFilterProduct["sortBy"];
}[] = [
  { id: "1", label: "liên quan", value: "relevancy" },
  { id: "2", label: "Mới Nhất", value: "news" },
  { id: "3", label: "Bán Chạy", value: "sales" },
];
