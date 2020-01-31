import React from 'react';
import {MinimalInputProps} from '../inputs/BaseInput';
import {Icon} from '../../Icon';
import {Button} from '../Button';


type ValidityToggleButtonProps = MinimalInputProps<boolean> ;


export const ValidityToggleButton = ({value, onChange, ...props}: ValidityToggleButtonProps) => {
  const icon = !value ? 'fa fa-check' : 'fas fa-ban';
  const variant = !value ? 'success' : 'danger';
  return (
    <Button size="md" onClick={() => onChange(!value)} variant={variant} {...props}>
      <Icon fa={icon} size={1} />
    </Button>
  );
};
