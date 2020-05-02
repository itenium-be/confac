export type UserModel = {
  _id: string;
  email: string;
  name: string;
  firstName: string;
  alias: string;
  active: boolean;
}


export type UserState = {
  users: UserModel[];
}
