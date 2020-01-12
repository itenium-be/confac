import React from 'react';
import App from './App';

type AppWithLayoutProps = {
  Component: any
}

// eslint-disable-next-line react/prefer-stateless-function
export class AppWithLayout extends React.Component<AppWithLayoutProps> {
  render() {
    const {Component, ...props} = this.props;
    return (
      <App {...props}>
        <Component {...props} />
      </App>
    );
  }
}
