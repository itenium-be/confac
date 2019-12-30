import React, {Component} from 'react';
import {FormCheck} from 'react-bootstrap';
import {EnhanceInputWithLabel, EnhanceInputWithLabelProps} from '../../../enhancers/EnhanceInputWithLabel';

export type BaseInputProps<TReturn> = EnhanceInputWithLabelProps & {
  value?: boolean,
  onChange: (e: TReturn) => void,
  style?: React.CSSProperties,
}

export const CheckboxInput = EnhanceInputWithLabel(class extends Component<BaseInputProps<any>> {
  render() {
    const {value, ...props} = this.props;
    return (
      <FormCheck
        checked={value}
        inline
        {...props}
      />
    );
  }
});
