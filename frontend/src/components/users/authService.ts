/* eslint-disable no-console */
import {SetStateAction} from 'react';
import request from 'superagent-bluebird-promise';
import {Dispatch} from 'redux';
import {buildUrl} from '../../actions/utils/buildUrl';
import {initialLoad} from '../../actions/initialLoad';
import {UserModel, Claim} from './models/UserModel';
import {getRoles} from '../../reducers/user-reducers';

interface IAuthService {
  loggedIn: () => boolean;
  login: (res: any, dispatch: Dispatch<any>, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) => void;
  anonymousLogin: (name: string) => void;
  logout: () => void;
  getBearer: () => string;
  getTokenString: () => string | null;
  getToken: () => JwtModel | null;
  getUser: () => UserModel | null;
  getClaims: () => Claim[],
  refresh: () => void;
  /** In ms */
  refreshInterval: () => number;
  /** For redirecting to after login */
  entryPathname: string;
}

type JwtModel = {
  iat: number;
  exp: number;
  data: UserModel;
}



class AuthService implements IAuthService {
  _jwt = '';
  _token: JwtModel | null = null;
  _claims: Claim[] = [];
  _fake = false;

  constructor() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.authenticated(jwt)
    }
  }

  loggedIn(): boolean {
    return !!this._jwt;
  }

  /**
   * @res: Google response
   * @setState: Uhoh, LoginPage.useState...
   */
  login(res: any, dispatch: Dispatch<any>, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) {
    dispatch(authenticateUser(res, setState));
  }

  anonymousLogin(name: string): void {
    this._fake = true;
    this._jwt = name;
    this._token = {
      iat: 0,
      exp: 0,
      data: {
        _id: name,
        email: name + '@itenium.be',
        name: 'X',
        firstName: name,
        alias: name,
        active: true,
        roles: ['admin'],
        audit: {
          createdOn: new Date().toISOString(),
          createdBy: name,
        },
      }
    };

    this._claims = Object.keys(Claim).filter(key => Number.isNaN(Number(key))).map(key => Claim[key]);
  }

  authenticated(jwt: string): void {
    localStorage.setItem('jwt', jwt);
    this._jwt = jwt;
    this._token = jwt ? parseJwt(jwt) : null;
    const user = this._token?.data;
    if (user) {
      this._claims = getRoles()
        .filter(x => (user.roles || []).includes(x.name))
        .map(x => x.claims)
        .flat();

    } else {
      this._claims = [];
    }
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this._jwt = '';
    this._token = null;
    this._claims = [];
  }

  getBearer(): string {
    return `Bearer ${this._jwt}`;
  }

  getTokenString(): string | null {
    return this._jwt || null;
  }

  getToken(): JwtModel | null {
    return this._token;
  }

  getUser(): UserModel | null {
    return this._token?.data || null;
  }

  getClaims(): Claim[] {
    return this._claims;
  }

  refresh(): void {
    if (!this._fake) {
      refreshToken();
    }
  }

  refreshInterval(): number {
    return +(localStorage.getItem('jwtInterval') || (60 * 60)) * 1000;
  }

  entryPathname = document.location.pathname;
};


export const authService = new AuthService();



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


function refreshToken(): void {
  request.post(buildUrl('/user/refresh'))
    .set('Content-Type', 'application/json')
    .set('Authorization', authService.getBearer())
    .set('Accept', 'application/json')
    .then(res => {
      console.log('refresh result', res.body);
      authService.authenticated(res.body.jwt);
    })
    .catch(err => {
      console.log('refresh error', err);
      authService.logout();
      window.open('/login');
    });
}



function authenticateUser(loginResponse: any, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) {
  setState('');

  console.log('loginResponse', loginResponse);
  const idToken = loginResponse.credential;
  return dispatch => {
    request.post(buildUrl('/user/login'))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({idToken})
      .then(res => {
        console.log('login result', res.body);
        authService.authenticated(res.body.jwt);
        dispatch(initialLoad());
        setState('loggedIn');
      })
      .catch(err => {
        console.log('login error', err);
        authService.logout();
        // window.location.reload();
        setState((err.body && err.body.err) || 'Unknown error');
      });
  };
}
