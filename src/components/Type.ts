export type PostType = {
  _id?: string;
  id?: string;
  tag: string;
  prompt: string;
  image_url?: string;
  audio_url?: string;
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
    name?: string | null | undefined;
    email?: string | null | undefined;
  };
  expires: string;
};

export type UserType = {
  _id: string;
  username: string;
  email: string;
  image: string;
  id?:string
};
