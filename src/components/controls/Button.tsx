import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button as ReactButton} from 'react-bootstrap';
import {Icon} from './Icon';
import { ConfacState } from '../../reducers/default-states';
import { BootstrapVariant } from '../../models';

type ButtonProps = {
  onClick: any,
  icon?: string,
  variant?: BootstrapVariant,
  size?: 'lg',
  children?: any,
}

export class Button extends Component<ButtonProps> {
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

type ButtonWithClickOnceProps = ButtonProps & {
  isBusy: boolean,
  disabled: boolean,
}

const EnhanceButtonWithClickOnce = ComposedComponent => class extends Component<ButtonWithClickOnceProps> {
  render() {
    const {isBusy, disabled, ...props} = this.props;

    return <ComposedComponent {...props} disabled={isBusy || disabled} />;
  }
};


export const BusyButton = connect((state: ConfacState) => ({isBusy: state.app.isBusy}), {})(EnhanceButtonWithClickOnce(Button));
