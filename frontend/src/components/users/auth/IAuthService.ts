import {SetStateAction} from 'react';
import {UserModel, Claim} from '../models/UserModel';
import {JwtModel} from '../models/JwtModel';
import {AppDispatch} from '../../../types/redux';

export interface IAuthService {
  loggedIn: () => boolean;
  login: (res: {credential: string}, dispatch: AppDispatch, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) => void;
  anonymousLogin: (name: string) => void;
  logout: () => void;
  getBearer: () => string;
  getTokenString: () => string | null;
  getToken: () => JwtModel | null;
  getUser: () => UserModel | null;
  getClaims: () => Claim[];
  refresh: () => void;
  /** In ms */
  refreshInterval: () => number;
  /** For redirecting to after login */
  entryPathname: string;
}
