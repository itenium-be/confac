import { Navigate } from 'react-router-dom';
import { authService } from '../../users/authService';

/** Redirect user after logging in */
export const Redirecter = () => {
  if (authService.entryPathname === '/login') {
    return <Navigate to="/" />;
  }

  return <Navigate to={authService.entryPathname} />;
};
