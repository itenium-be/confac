import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { t } from '../../utils';
import { authService } from '../../users/authService';
import { googleLogout } from '@react-oauth/google';
import { Button } from 'react-bootstrap';
import { Icon } from '../../controls/Icon';

/** Google logout button */
export const LogoutButton = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  const logout = () => {
    googleLogout();
    authService.logout();
    setLoggedIn(false);
  };

  return (
    <Button
      variant="danger"
      onClick={logout}>
        <Icon className="tst-icon-logout" fa="fab fa-google" size={1} style={{paddingRight: 8}} />
        {t('user.logout')}
    </Button>
  );
};
