/* eslint-disable no-console */
import {SetStateAction} from 'react';
import request from 'superagent-bluebird-promise';
import {Dispatch} from 'redux';
import {buildUrl} from '../../actions/utils/buildUrl';
import {initialLoad} from '../../actions/initialLoad';
import {UserModel, Claim} from './models/UserModel';
import {getRoles} from '../../reducers/user-reducers';
import {IAuthService} from './auth/IAuthService';
import {JwtModel} from './models/JwtModel';


class AuthService implements IAuthService {
  _fake = false;

  constructor() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.authenticated(jwt)
    }
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('jwt');
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
  }

  authenticated(jwt: string): void {
    localStorage.setItem('jwt', jwt);
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getBearer(): string {
    return `Bearer ${localStorage.getItem('jwt')}`;
  }

  getTokenString(): string | null {
    return localStorage.getItem('jwt') || null;
  }

  getToken(): JwtModel | null {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return null;
    }
    return parseJwt(token);
  }

  getUser(): UserModel | null {
    return this.getToken()?.data || null;
  }

  getClaims(): Claim[] {
    const user = this.getToken()?.data;
    if (user) {
      return getRoles()
        .filter(x => (user.roles || []).includes(x.name))
        .map(x => x.claims)
        .flat();

    }
    return [];
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

  // console.log('loginResponse', loginResponse);
  const idToken = loginResponse.credential;
  return dispatch => {
    request.post(buildUrl('/user/login'))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({idToken})
      .then(res => {
        // console.log('login result', res.body);
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
