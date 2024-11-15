interface IAvatar {
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
  avatar: IAvatar | null;
  avatarDefault: string;
  modifiedPassword: boolean;
  status: "online" | "offline";
  timeOffline?: Date;
  role: string;
}
