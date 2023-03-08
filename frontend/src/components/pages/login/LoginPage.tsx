import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {GoogleLogin} from '@leecheuk/react-google-login';
import {Alert} from 'react-bootstrap';
import {t} from '../../utils';
import {authService} from '../../users/authService';
import {buildRequest, initialLoad} from '../../../actions/initialLoad';
import { Redirecter } from './Redirecter';
import { AnonymousLogin } from './AnonymousLogin';


const requiredAccess = [
  'profile',
  'email',
  // 'https://www.googleapis.com/auth/profile.language.read',
  // 'https://www.googleapis.com/auth/admin.directory.group.readonly',
];


export const LoginPage = (props: any) => {
  const dispatch = useDispatch();
  const [state, setState] = useState<string | 'loggedIn'>('');
  const [errDetails, setErrDetails] = useState<string>('');
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);

  useEffect(() => {
    fetch(buildRequest('/config/security'))
      .then(res => res.json())
      .then(data => {
        setGoogleClientId(data.googleClientId);
        localStorage.setItem('googleClientId', data.googleClientId);
        localStorage.setItem('jwtInterval', data.jwtInterval);

        // Display & Save env & tag:
        // console.log('/config/security', data);
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

  console.log('googleClientId', googleClientId); // eslint-disable-line
  return (
    <div>
      {state && (
        <Alert variant="danger">
          {t(state)}
        </Alert>
      )}

      <GoogleLogin
        clientId={googleClientId}
        buttonText={t('user.login')}
        onSuccess={res => authService.login(res, dispatch, setState)}
        onFailure={err => {
          setState('user.loginError');
          if (err && err.details) {
            setErrDetails(err.details);
          }
          console.log('google-login-failure', err); // eslint-disable-line
        }}
        cookiePolicy="single_host_origin"
        scope={requiredAccess.join(' ')}
      />
      {errDetails && (<div className="err-details">{errDetails}</div>)}
    </div>
  );
};
