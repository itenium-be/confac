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
  size?: 'lg' | 'sm',
  children?: any,
  style?: object,
}

export class Button extends Component<ButtonProps> {
  static defaultProps: ButtonProps = {
    onClick: null,
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

type ButtonWithClickOnceProps = {
  isBusy: boolean,
  disabled?: boolean,
}

const EnhanceButtonWithClickOnce = <P extends object>(Component: React.ComponentType<P>): React.FC<P & ButtonWithClickOnceProps> =>
  ({ isBusy, disabled, ...props }: ButtonWithClickOnceProps) => {
    return <Component {...props as P} disabled={isBusy || disabled} />;
  }


export const BusyButton = connect((state: ConfacState) => ({isBusy: state.app.isBusy}), {})(EnhanceButtonWithClickOnce(Button));
