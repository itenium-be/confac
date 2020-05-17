import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {GoogleLogout} from 'react-google-login';
import {t} from '../utils';
import {authService} from '../users/authService';
import {Button} from '../controls/form-controls/Button';
import {Icon} from '../controls/Icon';


export const UserPage = () => {
  return (
    <div className="container">
      <Button onClick="/users" style={{float: 'right'}} variant="light">
        {t('user.users')}
        <Icon fa="fa fa-arrow-right" size={1} style={{marginLeft: 8}} />
      </Button>
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
        clientId={localStorage.getItem('googleClientId') || ''}
        buttonText={t('user.logout')}
        onLogoutSuccess={logout}
        onFailure={logout}
      />

      <h2 style={{marginTop: 34}}>JWT</h2>
      <pre>
        {JSON.stringify(authService.getToken(), null, 3)}
      </pre>
    </div>
  );
};
