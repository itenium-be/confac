import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Alert} from 'react-bootstrap';
import {t} from '../../utils';
import {authService} from '../../users/authService';
import {buildRequest, initialLoad} from '../../../actions/initialLoad';
import { Redirecter } from './Redirecter';
import { AnonymousLogin } from './AnonymousLogin';
import { GoogleLogin } from '@react-oauth/google';


export const LoginPage = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState<string | 'loggedIn'>('');
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);

  useEffect(() => {
    fetch(buildRequest('/config/security'))
      .then(res => res.json())
      .then(data => {
        setGoogleClientId(data.googleClientId);
        localStorage.setItem('googleClientId', data.googleClientId);
        localStorage.setItem('jwtInterval', data.jwtInterval);

        // Display & Save env & tag:
        console.log('/config/security', data);
        delete data.googleClientId;
        delete data.jwtInterval;
        localStorage.setItem('version', JSON.stringify(data));
      });
  }, [dispatch]);

  const anonymousLogin = (name: string) => {
    authService.anonymousLogin(name);
    setState('loggedIn');
    dispatch(initialLoad());
  }

  if (state === 'loggedIn') {
    return <Redirecter />;
  }

  if (!googleClientId) {
    const anonUserName = localStorage.getItem('anonUser');
    if (anonUserName) {
      anonymousLogin(anonUserName);
      return <Redirecter />;
    }
    return <AnonymousLogin onLogin={userName => anonymousLogin(userName)} />;
  }

  return (
    <div>
      {state && (
        <Alert variant="danger">
          {t(state)}
        </Alert>
      )}

      <GoogleLogin
        useOneTap
        auto_select
        size="large"
        logo_alignment="left"
        shape="circle"
        type="standard"
        theme="outline"
        ux_mode="popup"
        context="use"
        onSuccess={credentialResponse => {
          console.log('googleSuccess', credentialResponse);
          authService.login(credentialResponse, dispatch, setState);
        }}
        onError={() => {
          setState('user.loginError');
        }}
      />
    </div>
  );
};
