import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {GoogleLogout} from 'react-google-login';
import {t} from '../utils';
import {authService} from '../../actions/utils/authService';


export const UserPage = () => {
  return (
    <div className="container">
      <Logout />
    </div>
  );
};



export const Logout = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  if (!loggedIn) {
    return <Redirect to="/login" />;
  }

  const logout = () => {
    authService.logout();
    setLoggedIn(false);
  };

  return (
    <div>
      <GoogleLogout
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
        buttonText={t('user.logout')}
        onLogoutSuccess={logout}
        onFailure={logout}
      />
    </div>
  );
};
