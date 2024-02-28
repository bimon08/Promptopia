export type PostType = {
  _id?: string;
  tag: string;
  prompt: string;
  image_url?: string;
  user?: {
    id?: string;
    image?: string;
    username?: string;
    email: string;
  };
};

export type SessionType = {
  user: {
    id: string;
    image: string;
  };
  expires: string;
};

export type UserType = {
  _id: string;
  username: string;
  email: string;
  image: string;
};
