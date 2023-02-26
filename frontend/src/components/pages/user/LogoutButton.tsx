import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GoogleLogout } from '@leecheuk/react-google-login';
import { t } from '../../utils';
import { authService } from '../../users/authService';

/** Google logout button */
export const LogoutButton = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  const logout = () => {
    authService.logout();
    setLoggedIn(false);
  };

  return (
    <GoogleLogout
      clientId={localStorage.getItem('googleClientId') || ''}
      buttonText={t('user.logout')}
      onLogoutSuccess={logout}
      onFailure={logout} />
  );
};
