import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-bootstrap';
import 'react-ios-switch/build/bundle.css';

import Header from './skeleton/Header.js';

class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }
  render() {
    return (
      <div className="App">
        <NotificationsSystem theme={theme} />
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default connect(state => ({config: state.config, clients: state.clients}))(App);
