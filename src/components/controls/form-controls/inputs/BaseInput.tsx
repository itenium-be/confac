import React, {Component} from 'react';
import {FormControl} from 'react-bootstrap';
import {EnhanceInputWithLabel, EnhanceInputWithLabelProps} from '../../../enhancers/EnhanceInputWithLabel';
import {EnhanceInputWithAddons, EnhanceInputWithAddonsProps} from '../../../enhancers/EnhanceInputWithAddons';

export type BaseInputProps<T, TReturn = T> = EnhanceInputWithAddonsProps & EnhanceInputWithLabelProps & {
  type?: 'textarea' | 'text' | 'number',
  value?: T,
  onChange: (e: TReturn) => void,
  onBlur?: (e: any) => void,
  style?: React.CSSProperties,
  placeholder?: string,
  autoFocus?: boolean,
  /** ATTN: Technical debt: leakage of the FormConfig */
  updateOnly?: boolean,
}

export const BaseInput = EnhanceInputWithLabel(EnhanceInputWithAddons(class extends Component<BaseInputProps<any>> {
  render() {
    const {type, updateOnly, ...props} = this.props;
    return (
      <FormControl
        type={type === 'textarea' ? 'text' : type}
        as={type === 'textarea' ? 'textarea' : undefined}
        className={type === 'textarea' ? 'textarea' : undefined}
        {...props}
      />
    );
  }
}));
