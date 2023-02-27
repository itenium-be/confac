import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { t } from '../../utils';
import { authService } from '../../users/authService';
import { Button } from '../../controls/form-controls/Button';

/** Google logout button */
export const LogoutButton = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  const logout = () => {
    authService.logout();
    setLoggedIn(false);
    googleLogout();
  };

  return (
    <Button variant="outline-secondary" onClick={logout}>
      {t('user.logout')}
    </Button>
  );
};
