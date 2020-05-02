import React from 'react';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import App from './App';
import {ConfacState} from '../reducers/app-state';
import {LoadingPage} from './pages/LoadingPage';
import {authService} from './users/authService';

type AppWithLayoutProps = {
  Component: any
}

export const AppWithLayout = ({Component, ...props}: AppWithLayoutProps) => {
  const isLoaded = useSelector((state: ConfacState) => state.app.isLoaded);

  if (!authService.loggedIn()) {
    return <Redirect to="/login" />;
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
