import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import App from './App';
import {ConfacState} from '../reducers/app-state';
import {LoadingPage} from './pages/LoadingPage';
import {authService} from './users/authService';
import {useInterval} from './hooks/useInterval';

type AppWithLayoutProps = {
  Component: any
}

export const AppWithLayout = ({Component, ...props}: AppWithLayoutProps) => {
  const isLoaded = useSelector((state: ConfacState) => state.app.isLoaded);
  useInterval(() => {
    authService.refresh();
  }, authService.refreshInterval());

  if (!authService.loggedIn()) {
    return <Navigate to="/login" />;
  }

  if (!isLoaded) {
    return <App {...props}><LoadingPage /></App>;
  }

  return (
    <App {...props}>
      <Component {...props} />
    </App>
  );
};
