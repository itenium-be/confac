import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button as ReactButton} from 'react-bootstrap';

export class Button extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    bsStyle: PropTypes.string,
    bsSize: PropTypes.string,
  }
  static defaultProps = {
    bsStyle: 'primary',
    bsSize: 'large',
  }
  render() {
    const {children, ...props} = this.props;
    return (
      <ReactButton {...props} data-tst={this.props['data-tst']}>
        {children}
      </ReactButton>
    );
  }
}


const EnhanceButtonWithClickOnce = ComposedComponent => class extends Component {
  static propTypes = {
    isBusy: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
  }

  render() {
    const {isBusy, disabled, ...props} = this.props;
    return <ComposedComponent {...props} disabled={isBusy || disabled} />;
  }
};
export const BusyButton = connect(state => ({isBusy: state.app.isBusy}), {})(EnhanceButtonWithClickOnce(Button));
