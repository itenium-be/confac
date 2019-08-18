import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button as ReactButton} from 'react-bootstrap';
import {Icon} from './Icon';

export class Button extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    variant: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.string,
  }
  static defaultProps = {
    variant: 'primary',
    size: 'lg',
  }
  render() {
    const {children, icon, ...props} = this.props;
    return (
      <ReactButton {...props} data-tst={this.props['data-tst']}>
        {icon ? <Icon fa={icon} size={1} style={{marginRight: 6}} data-tst={this.props['data-tst'] + '-icon'} /> : null}
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
