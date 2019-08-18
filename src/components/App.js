import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Header from './skeleton/Header.js';

import {ToastContainer} from 'react-toastify';
// import { success, failure } from '../actions/appActions.js';
// <button onClick={() => success("greato success")}>Success</button>
// <button onClick={() => failure("oh noes")}>Error</button>


// https://github.com/fkhadra/react-toastify#api
const ConfiguredToastContainer = () => (
  <ToastContainer
    hideProgressBar={true}
    pauseOnHover={true}
    pauseOnFocusLoss={false}
    toastClassName="confac-toast"
  />
);


class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }
  render() {
    return (
      <div className="App">
        <ConfiguredToastContainer />
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default connect(state => ({config: state.config, clients: state.clients}))(App);
