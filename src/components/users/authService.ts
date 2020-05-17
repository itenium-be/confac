/* eslint-disable no-console */
import {SetStateAction} from 'react';
import request from 'superagent-bluebird-promise';
import {Dispatch} from 'redux';
import {buildUrl} from '../../actions/utils/buildUrl';
import {initialLoad} from '../../actions/initialLoad';
import {UserModel} from './models/UserModel';


interface IAuthService {
  loggedIn: () => boolean;
  login: (res: any, dispatch: Dispatch<any>, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) => void;
  logout: () => void;
  getBearer: () => string;
  getToken: () => JwtModel | null;
  getUser: () => UserModel | null;
}

type JwtModel = {
  iat: number;
  exp: number;
  data: UserModel;
}


export const authService: IAuthService = {
  loggedIn: () => !!sessionStorage.getItem('jwt'),
  login: (res: any, dispatch: Dispatch<any>, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) => {
    dispatch(authenticateUser(res, setState));
  },
  logout: () => {
    sessionStorage.removeItem('jwt');
  },
  getBearer: (): string => `Bearer ${sessionStorage.getItem('jwt')}`,
  getToken: (): JwtModel | null => {
    const token = sessionStorage.getItem('jwt');
    if (!token) {
      return null;
    }
    return parseJwt(token);
  },
  getUser: (): UserModel | null => {
    const token = authService.getToken();
    if (!token) {
      return null;
    }
    return token.data;
  },
};

function parseJwt(token: string): JwtModel {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join(''),
  );

  return JSON.parse(jsonPayload);
}



function authenticateUser(loginResponse: any, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) {
  setState('');

  const idToken = loginResponse.tc.id_token;
  return dispatch => {
    request.post(buildUrl('/user/login'))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({idToken})
      .then(res => {
        console.log('login result', res.body);
        sessionStorage.setItem('jwt', res.body.jwt);
        dispatch(initialLoad());
        setState('loggedIn');
      })
      .catch(err => {
        console.log('login error', err);
        setState((err.body && err.body.err) || 'Unknown error');
      });
  };
}