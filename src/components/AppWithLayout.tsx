import React from 'react';
import PropTypes from 'prop-types';
import App from './App';

export class AppWithLayout extends React.Component {
  static propTypes = {
    Component: PropTypes.any.isRequired,
  }

  render() {
    const {Component, ...props} = this.props;
    return (
      <App {...props}>
        <Component {...props}/>
      </App>
    );
  }
}
