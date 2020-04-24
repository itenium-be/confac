import React from 'react';
import {useSelector} from 'react-redux';
import App from './App';
import {ConfacState} from '../reducers/app-state';
import {LoadingPage} from './pages/LoadingPage';

type AppWithLayoutProps = {
  Component: any
}

export const AppWithLayout = ({Component, ...props}: AppWithLayoutProps) => {
  const isLoaded = useSelector((state: ConfacState) => state.app.isLoaded);
  if (!isLoaded) {
    return <App {...props}><LoadingPage /></App>;
  }

  return (
    <App {...props}>
      <Component {...props} />
    </App>
  );
};
