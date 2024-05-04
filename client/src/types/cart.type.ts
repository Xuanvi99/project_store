export interface ICart {
  _id: string;
  userId: string;
  listProduct: {
    productId: string;
    size: string;
    quantity: string;
  }[];
}
