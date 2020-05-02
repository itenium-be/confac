/* eslint-disable no-console */
import {SetStateAction} from 'react';
import request from 'superagent-bluebird-promise';
import {Dispatch} from 'redux';
import {buildUrl} from './buildUrl';


interface IAuthService {
  loggedIn: () => boolean;
  login: (res: any, dispatch: Dispatch<any>, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) => void;
  logout: () => void;
}


export const authService: IAuthService = {
  loggedIn: () => !!sessionStorage.getItem('jwt'),
  login: (res: any, dispatch: Dispatch<any>, setState: React.Dispatch<SetStateAction<string | 'loggedIn'>>) => {
    dispatch(authenticateUser(res, setState));
  },
  logout: () => {
    sessionStorage.removeItem('jwt');
  },
};



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
        setState('loggedIn');
      })
      .catch(err => {
        console.log('login error', err);
        setState((err.body && err.body.err) || 'Unknown error');
      });
  };
}
