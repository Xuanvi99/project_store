interface imageUrl {
  _id: string;
  public_id: string;
  url: string;
  folder: string;
}

export interface IProductReq {
  name: string;
  summary: string;
  desc: string;
  brand: string;
  price: number;
  status: string;
  thumbnail: File | null;
  images: File[] | null;
  specs: string;
}

export interface IProductRes {
  name: string;
  slug: string;
  summary: string;
  desc: string;
  brand: string;
  thumbnail: imageUrl;
  price: number;
  discount: number;
  flashSale: boolean;
  sold: number;
  status: string;
  imageIds: [imageUrl];
  commentIds: unknown[];
  categoryId: { _id: string; name: string };
  is_delete: boolean;
}
