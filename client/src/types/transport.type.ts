export interface shippingFee {
  service_id: number;
  insurance_value: number;
  coupon: string | null;
  from_district_id: number;
  from_ward_code: string;
  to_district_id: number;
  to_ward_code: string;
  height: number;
  length: number;
  weight: number;
  width: number;
}

export interface timeShipping {
  ShopID: number;
  service_id: number;
  from_district_id: number;
  from_ward_code: string;
  to_district_id: number;
  to_ward_code: string;
}

export interface transportRes<T> {
  code: number;
  message: string;
  data: T | null;
}

export type resShippingFee = {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
};

const exampleTimeShipping = {
  leadtime: 1593187200,
  order_date: 1592981718,
};

export type resTimeShipping = typeof exampleTimeShipping;
