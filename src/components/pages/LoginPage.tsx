import React, {useState, useEffect} from 'react';
import {Navigate, Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {GoogleLogin} from '@leecheuk/react-google-login';
import {Alert} from 'react-bootstrap';
import {t} from '../utils';
import {authService} from '../users/authService';
import {buildRequest} from '../../actions/initialLoad';

const Redirecter = () => {
  if (authService.entryPathname === '/login') {
    return <Navigate to="/" />;
  }

  return <Navigate to={authService.entryPathname} />;
};


export const UnauthicatedAppLayout = ({Component, props}: any) => {
  if (authService.loggedIn()) {
    return <Redirecter />;
  }

  return (
    <div className="container unauthicated">
      <Link to="/">
        <img src="/img/itenium.png" role="presentation" alt="itenium logo" />
      </Link>
      <hr />
      <Component {...props} />
    </div>
  );
};




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
      });
  }, []);

  if (state === 'loggedIn') {
    return <Redirecter />;
  }

  if (!googleClientId) {
    return <div />;
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
