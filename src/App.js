import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';

import Header from './skeleton/Header.js';

class App extends Component {
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
