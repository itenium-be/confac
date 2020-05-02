import React, {useState} from 'react';
import {useHistory, Redirect} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {GoogleLogin} from 'react-google-login';
import {Alert} from 'react-bootstrap';
import {t} from '../utils';
import {authService} from '../../actions/utils/authService';



export const UnauthicatedAppLayout = ({Component, props}: any) => {
  if (authService.loggedIn()) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container unauthicated">
      <img src="/img/itenium.png" role="presentation" alt="itenium logo" />
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

  if (state === 'loggedIn') {
    history.goBack();
    return <div />;
  }

  return (
    <div>
      {state && (
        <Alert variant="danger">
          {t(state)}
        </Alert>
      )}

      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
        buttonText={t('user.login')}
        onSuccess={res => authService.login(res, dispatch, setState)}
        onFailure={() => setState('user.loginError')}
        cookiePolicy="single_host_origin"
        scope={requiredAccess.join(' ')}
      />
    </div>
  );
};
