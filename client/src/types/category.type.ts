interface imageUrl {
  url: string;
  folder: string;
}

export interface ICategory {
  _id: string;
  name: string;
  image: imageUrl;
}
