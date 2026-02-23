
import {SetStateAction} from 'react';
import {buildUrl} from '../../actions/utils/buildUrl';
import {AppDispatch} from '../../types/redux';
import {initialLoad} from '../../actions/initialLoad';
import {UserModel, Claim} from './models/UserModel';
import {getRoles} from '../../reducers/user-reducers';
import {IAuthService} from './auth/IAuthService';
import {JwtModel} from './models/JwtModel';
import {getFakeClaims, getFakeJwtToken} from './auth/auth-helpers';

class AuthService implements IAuthService {
  _jwt = '';
  _token: JwtModel | null = null;
  _claims: Claim[] = [];
  _fake = false;

  constructor() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.authenticated(jwt);
    }
  }

  loggedIn(): boolean {
    return !!this._jwt;
  }

  /**
   * @res: Google response
   * @setState: Uhoh, LoginPage.useState...
   */
  login(res: {credential: string}, dispatch: AppDispatch, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) {
    dispatch(authenticateUser(res, setState));
  }

  anonymousLogin(name: string): void {
    this._fake = true;
    this._jwt = name;
    this._token = getFakeJwtToken(name);
    this._claims = getFakeClaims();
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
}


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


async function refreshToken(): Promise<void> {
  try {
    const response = await fetch(buildUrl('/user/refresh'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authService.getBearer(),
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    console.log('refresh result', data);
    authService.authenticated(data.jwt);
  } catch (err) {
    console.log('refresh error', err);
    authService.logout();
    window.open('/login');
  }
}



function authenticateUser(loginResponse: {credential: string}, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) {
  setState('');

  console.log('loginResponse', loginResponse);
  const idToken = loginResponse.credential;
  return async (dispatch: AppDispatch) => {
    try {
      const response = await fetch(buildUrl('/user/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({idToken}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {body: data};
      }

      console.log('login result', data);
      authService.authenticated(data.jwt);
      dispatch(initialLoad());
      setState('loggedIn');
    } catch (err: unknown) {
      console.log('login error', err);
      authService.logout();
      const errObj = err as {body?: {err?: string}};
      setState((errObj.body && errObj.body.err) || 'Unknown error');
    }
  };
}
