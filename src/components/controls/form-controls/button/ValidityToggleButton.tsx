import React from 'react';
import {MinimalInputProps} from '../inputs/BaseInput';
import {Button} from '../Button';
import {BootstrapVariant} from '../../../../models';


type ValidityToggleButtonProps = MinimalInputProps<boolean> & {
  /** True: Outline-Success/Danger. False Success/Danger bootstrap classes */
  outline?: boolean;
  /** Button tooltip */
  title?: string | {on: string, off: string, disabled: string};
};


export const ValidityToggleButton = ({value, onChange, outline, title, disabled, ...props}: ValidityToggleButtonProps) => {
  const icon = !value ? 'fa fa-check' : 'fas fa-ban';

  let variant: BootstrapVariant;
  if (outline) {
    variant = !value ? 'outline-success' : 'outline-danger';
  } else {
    variant = !value ? 'success' : 'danger';
  }

  let tooltip: string | undefined;
  if (!title || typeof title === 'string') {
    tooltip = title;

  } else if (disabled) {
    tooltip = title.disabled;
  } else {
    tooltip = value ? title.off : title.on;
  }


  return (
    <Button
      onClick={() => onChange(!value)}
      variant={variant}
      icon={icon}
      title={tooltip}
      disabled={disabled}
      {...props}
    />
  );
};
