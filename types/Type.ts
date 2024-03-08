export interface IUser {
  id: string;
  username: string;
  email: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPost {
  id: string;
  tag: string;
  message: string;
  imageUrl?: string;
  audioUrl?: string;
  user?: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISession {
  user: IUser;
  expires: string;
}
