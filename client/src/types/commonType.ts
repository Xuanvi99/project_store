interface avatar {
  _id: string;
  public_id: string;
  url: string;
  folder: string;
}

export interface IUser {
  _id: string;
  userName: string;
  phone: string;
  email: string;
  date: string;
  address: string;
  avatar: avatar | null;
  gender: "male" | "female" | "other";
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
