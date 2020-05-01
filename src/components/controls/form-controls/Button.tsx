import React from 'react';
import {useHistory} from 'react-router-dom';
import {Button as ReactButton} from 'react-bootstrap';
import {Icon} from '../Icon';
import {BootstrapVariant} from '../../../models';
import {Tooltip} from '../Tooltip';

export type ButtonSize = 'lg' | 'sm' | 'md';

type ButtonProps = {
  onClick: Function | string,
  /** Full fa. ex: "far fa-xxx" */
  icon?: string,
  variant?: BootstrapVariant,
  size?: ButtonSize,
  children?: any,
  style?: React.CSSProperties,
  disabled?: boolean;
  className?: string;
  title?: string;
}

export const Button = ({variant = 'primary', size = 'md', disabled, className, style, title, ...props}: ButtonProps) => {
  const history = useHistory();
  const {children, icon, onClick, ...rest} = props;

  let realClick: any = onClick;
  if (typeof onClick === 'string') {
    realClick = () => {
      history.push(onClick);
    };
  }

  let FinalButton = (
    <ReactButton
      className={className}
      variant={variant}
      size={size === 'md' ? undefined : size}
      onClick={realClick}
      disabled={disabled}
      style={style}
      {...rest}
    >
      {icon ? <Icon fa={icon} size={1} style={{marginRight: children ? 6 : 0}} /> : null}
      {children}
    </ReactButton>
  );

  if (title) {
    FinalButton = (
      <Tooltip title={title}>
        {FinalButton}
      </Tooltip>
    );
  }

  return FinalButton;
};
