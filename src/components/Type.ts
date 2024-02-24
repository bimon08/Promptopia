export type PostType = {
  _id?: string;
  tag: string;
  creator?: {
    _id: string;
    username: string;
    email: string;
    image: string;
  };
  prompt: string;
  image_url?: string;
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
