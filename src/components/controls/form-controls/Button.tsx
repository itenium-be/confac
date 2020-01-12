import React, {Component} from 'react';
import {Button as ReactButton} from 'react-bootstrap';
import {Icon} from '../Icon';
import {BootstrapVariant} from '../../../models';

type ButtonProps = {
  onClick: any,
  icon?: string,
  variant?: BootstrapVariant,
  size?: 'lg' | 'sm',
  children?: any,
  style?: React.CSSProperties,
}

export const Button = ({variant = 'primary', size = 'lg', ...props}: ButtonProps) => {
  const {children, icon, ...rest} = props;
  return (
    <ReactButton variant={variant} size={size} {...rest}>
      {icon ? <Icon fa={icon} size={1} style={{marginRight: 6}} data-tst={`${props['data-tst']}-icon`} /> : null}
      {children}
    </ReactButton>
  );
};
