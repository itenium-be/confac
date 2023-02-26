import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../users/authService';
import { Button } from '../../controls/form-controls/Button';

/** Logout button when deployed without security */
export const AnonymousLogoutButton = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  const logout = () => {
    localStorage.removeItem('anonUser');
    authService.logout();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <Button variant="outline-secondary" onClick={logout}>
      Logout
    </Button>
  );
};
