import React from 'react';
import {useHistory} from 'react-router-dom';
import {Button as ReactButton} from 'react-bootstrap';
import {Icon} from '../Icon';
import {BootstrapVariant} from '../../../models';

type ButtonProps = {
  onClick: Function | string,
  icon?: string,
  variant?: BootstrapVariant,
  size?: 'lg' | 'sm',
  children?: any,
  style?: React.CSSProperties,
}

export const Button = ({variant = 'primary', size = 'lg', ...props}: ButtonProps) => {
  const history = useHistory();
  const {children, icon, onClick, ...rest} = props;

  let realClick: any = onClick;
  if (typeof onClick === 'string') {
    realClick = () => {
      history.push(onClick);
    };
  }

  return (
    <ReactButton variant={variant} size={size} onClick={realClick} {...rest}>
      {icon ? <Icon fa={icon} size={1} style={{marginRight: 6}} data-tst={`${props['data-tst']}-icon`} /> : null}
      {children}
    </ReactButton>
  );
};
