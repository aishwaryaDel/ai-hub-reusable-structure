export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
}

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}
