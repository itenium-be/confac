import React, { Component } from 'react';

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

export default App;
