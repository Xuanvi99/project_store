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
  gender: "male" | "female" | "other";
  avatar: avatar | null;
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

export interface IAddress {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  ward?: string;
  specific: string;
}
