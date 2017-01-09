import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Header from './skeleton/Header.js';

class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }
  render() {
    return (
      <div className="App">
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default connect(state => ({config: state.config, clients: state.clients}))(App);
