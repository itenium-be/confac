import React from 'react';
import App from './App';

type AppWithLayoutProps = {
  Component: any
}

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
