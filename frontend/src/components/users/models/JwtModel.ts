import { UserModel } from './UserModel';


export type JwtModel = {
  iat: number;
  exp: number;
  data: UserModel;
};
