import { Role } from './role.interface';

export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  roles: Role[];
}