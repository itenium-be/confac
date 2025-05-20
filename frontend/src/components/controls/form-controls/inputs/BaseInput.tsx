import {Component} from 'react';
import {FormControl} from 'react-bootstrap';
import {EnhanceInputWithLabel, EnhanceInputWithLabelProps} from '../../../enhancers/EnhanceInputWithLabel';
import {EnhanceInputWithAddons, EnhanceInputWithAddonsProps,
  EnhanceInputWithDisplayProps, EnhanceInputWithDisplay} from '../../../enhancers/EnhanceInputWithAddons';



export type MinimalInputProps<T, TReturn = T> = {
  value?: T;
  onChange: (e: TReturn) => void;
  disabled?: boolean;
};


export type BaseInputProps<T, TReturn = T> =
  MinimalInputProps<T, TReturn>
  & EnhanceInputWithAddonsProps
  & EnhanceInputWithLabelProps
  & EnhanceInputWithDisplayProps
  & {
  type?: 'textarea' | 'text' | 'number';
  onBlur?: (e: any) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  /** ATTN: Technical debt: leakage of the FormConfig */
  updateOnly?: boolean;
}

// eslint-disable-next-line react/prefer-stateless-function
export const BaseInput = EnhanceInputWithDisplay(EnhanceInputWithLabel(EnhanceInputWithAddons(class extends Component<BaseInputProps<any>> {
  render() {
    const {type, updateOnly, ...props} = this.props;
    return (
      <FormControl
        type={type === 'textarea' ? 'text' : type}
        as={type === 'textarea' ? 'textarea' : undefined}
        className={type === 'textarea' ? 'textarea' :'tst-input-base'}
        {...props}
      />
    );
  }
})));
