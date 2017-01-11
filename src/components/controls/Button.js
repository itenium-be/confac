import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button as ReactButton } from 'react-bootstrap';

export class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    bsStyle: PropTypes.string,
  }
  static defaultProps = {
    bsStyle: 'primary',
  }
  render() {
    const {children, ...props} = this.props;
    return (
      <ReactButton bsSize="large" {...props}>
        {children}
      </ReactButton>
    );
  }
}

export const EnhanceWithClickOnce = ComposedComponent => class extends Component {
  static propTypes = {isBusy: PropTypes.bool.isRequired};
  render() {
    const {isBusy, ...props} = this.props;
    return <ComposedComponent {...props} disabled={isBusy} />;
  }
};

export const BusyButton = connect(state => ({isBusy: state.app.isBusy}), {})(EnhanceWithClickOnce(Button));
