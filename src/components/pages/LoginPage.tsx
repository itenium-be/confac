import React, {useState, useEffect} from 'react';
import {useHistory, Redirect, Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {GoogleLogin} from 'react-google-login';
import {Alert} from 'react-bootstrap';
import {t} from '../utils';
import {authService} from '../users/authService';
import {buildRequest} from '../../actions/initialLoad';




export const UnauthicatedAppLayout = ({Component, props}: any) => {
  if (authService.loggedIn()) {
    return <Redirect to="/" />;
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
  const history = useHistory();
  const [state, setState] = useState<string | 'loggedIn'>('');
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);

  useEffect(() => {
    fetch(buildRequest('/config/security'))
      .then(res => res.json())
      .then(data => {
        setGoogleClientId(data.googleClientId);
        localStorage.setItem('googleClientId', data.googleClientId);
      });
  }, []);

  if (state === 'loggedIn') {
    // TODO: need to find if the previous path was /login
    // ie we opened on the login page, then redirect to the
    // index, otherwise redirect to where we came from!
    if (document.location.pathname === '/login') {
      return <Redirect to="/" />;
    }

    history.goBack();
    return <div />;
  }

  if (!googleClientId) {
    return <div />;
  }

  console.log('googleClientId', googleClientId);

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
        onFailure={err => {setState('user.loginError'); console.log('google-login-failure', err);}}
        cookiePolicy="single_host_origin"
        scope={requiredAccess.join(' ')}
      />
    </div>
  );
};
