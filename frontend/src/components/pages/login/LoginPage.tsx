import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { t } from '../../utils';
import { authService } from '../../users/authService';
import { initialLoad } from '../../../actions/initialLoad';
import { Redirecter } from './Redirecter';
import { AnonymousLogin } from './AnonymousLogin';
import { GoogleLogin } from '@react-oauth/google';
import { ConfacState } from '../../../reducers/app-state';

/** Google or anonymous login */
export const LoginPage = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState<string | 'loggedIn'>('');
  const googleClientId = useSelector((state: ConfacState) => state.app.securityConfig.googleClientId);

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
    <>
      {state && (<Alert variant="danger">{t(state)}</Alert>)}
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
        onSuccess={credentialResponse => authService.login(credentialResponse, dispatch, setState)}
        onError={() => setState('user.loginError')}
      />
    </>
  );
};
