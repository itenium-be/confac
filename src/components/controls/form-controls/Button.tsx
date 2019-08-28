import React, {Component} from 'react';
import {Button as ReactButton} from 'react-bootstrap';
import {Icon} from '../Icon';
import { BootstrapVariant } from '../../../models';

type ButtonProps = {
  onClick: any,
  icon?: string,
  variant?: BootstrapVariant,
  size?: 'lg' | 'sm',
  children?: any,
  style?: React.CSSProperties,
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
