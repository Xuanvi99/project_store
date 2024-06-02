export interface IAddress {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  province: string;
  provinceId: number;
  district: string;
  districtId: number;
  ward?: string;
  wardCode?: string;
  specific: string;
}
