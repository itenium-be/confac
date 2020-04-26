import React from 'react';
import {MinimalInputProps} from '../inputs/BaseInput';
import {Icon} from '../../Icon';
import {Button} from '../Button';
import {BootstrapVariant} from '../../../../models';


type ValidityToggleButtonProps = MinimalInputProps<boolean> & {
  outline?: boolean;
  title?: string;
};


export const ValidityToggleButton = ({value, onChange, outline, ...props}: ValidityToggleButtonProps) => {
  const icon = !value ? 'fa fa-check' : 'fas fa-ban';

  let variant: BootstrapVariant;
  if (outline) {
    variant = !value ? 'outline-success' : 'outline-danger';
  } else {
    variant = !value ? 'success' : 'danger';
  }


  return (
    <Button size="md" onClick={() => onChange(!value)} variant={variant} {...props}>
      <Icon fa={icon} size={1} />
    </Button>
  );
};
