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

export interface serviceShip {
  shop_id: number;
  from_district: number;
  to_district: number;
}

export interface timeShipping {
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

export type resServiceShip = {
  service_id: number;
  short_name: string;
};

const exampleTimeShipping = {
  leadtime: 1593187200,
  order_date: 1592981718,
};

export type resTimeShipping = typeof exampleTimeShipping;

const exampleCreateOrder = {
  note: "Tintest 123",
  required_note: "KHONGCHOXEMHANG",
  from_name: "TinTest124",
  from_phone: "0987654321",
  from_address: "72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam",
  from_ward_name: "Phường 14",
  from_district_name: "Quận 10",
  from_province_name: "HCM",
  return_phone: "0332190444",
  return_address: "39 NTT",
  return_district_id: 1,
  return_ward_code: "",
  client_order_code: "",
  to_name: "TinTest124",
  to_phone: "0987654321",
  to_address: "72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam",
  to_ward_code: "20308",
  to_district_id: 1444,
  cod_amount: 200000,
  content: "Theo New York Times",
  weight: 200,
  length: 1,
  width: 19,
  height: 10,
  pick_station_id: 1444,
  deliver_station_id: null,
  insurance_value: 4000000,
  service_id: 0,
  service_type_id: 2,
  coupon: null,
  pick_shift: [2],
};

type itemOrder = {
  name: string;
  code: string;
  quantity: number;
  price: number;
  length: number;
  width: number;
  height: number;
  weight: number;
};

const exampleResCreateOrder = {
  order_code: "LVVN76",
  sort_code: "0-000-0-A3",
  trans_type: "truck",
  ward_encode: "",
  district_encode: "",
  fee: {
    main_service: 110001,
    insurance: 20000,
    cod_fee: 0,
    station_do: 0,
    station_pu: 0,
    return: 0,
    r2s: 0,
    return_again: 0,
    coupon: 0,
    document_return: 0,
    double_check: 0,
    double_check_deliver: 0,
    pick_remote_areas_fee: 0,
    deliver_remote_areas_fee: 0,
    pick_remote_areas_fee_return: 0,
    deliver_remote_areas_fee_return: 0,
    cod_failed_fee: 0,
  },
  total_fee: 130001,
  expected_delivery_time: "2024-07-12T23:59:59Z",
  operation_partner: "",
};

type TExampleCreateOrder = typeof exampleCreateOrder;
export type reqCreateOrder = {
  payment_type_id: 1 | 2;
  items: itemOrder[] | [];
} & TExampleCreateOrder;
export type resCreateOrder = typeof exampleResCreateOrder;
