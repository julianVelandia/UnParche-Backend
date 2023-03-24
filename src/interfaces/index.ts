export interface IUser {
  email: string;
  password: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGroup{
  category: string;
  name: string;
  description: string;
  members: string;
  administrators: string;
  createdAt: string;
  updatedAt: string;
}