export interface IUser {
  _id: string;
  userName: string;
  phone: string;
  email: string;
  date: string;
  address: string;
  avatar: string;
  avatarDefault: string;
  role: string;
}

export interface ICart {
  _id: string;
  userId: string;
  listProduct: {
    productId: string;
    size: string;
    quantity: string;
  }[];
}
