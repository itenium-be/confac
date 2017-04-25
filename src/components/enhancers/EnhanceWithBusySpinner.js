import React, {Component, PropTypes} from 'react';
import {SpinnerIcon} from '../controls/Icon.js';

export const EnhanceWithBusySpinner = ComposedComponent => class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    isBusy: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    model: PropTypes.any.isRequired,
  };
  constructor() {
    super();
    this.state = {isBusy: false};
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.isBusy && this.props.model !== nextProps.model) {
      this.setState({isBusy: false});
    }
  }
  render() {
    const {isBusy, onClick, dispatch, model, ...props} = this.props; // eslint-disable-line
    if (isBusy && this.state.isBusy) {
      return <SpinnerIcon style={{marginLeft: 0}} data-tst={this.props['data-tst']} />;
    }

    const realOnclick = () => {
      this.setState({isBusy: true});
      onClick();
    };
    return <ComposedComponent {...props} onClick={realOnclick} />;
  }
};
