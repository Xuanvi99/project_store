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
