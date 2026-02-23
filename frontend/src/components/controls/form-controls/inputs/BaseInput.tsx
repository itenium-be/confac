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
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  /** ATTN: Technical debt: leakage of the FormConfig */
  updateOnly?: boolean;
}


// Note: BaseInputProps has onChange typed as (value: T) => void, but FormControl
// calls onChange with an event. Consumers of BaseInput (StringInput, NumericInput, etc.)
// handle this mismatch by extracting e.target.value. We use React.ChangeEvent here
// to properly type the FormControl's actual onChange behavior.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class BaseInputComponent extends Component<BaseInputProps<any, React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>>> {
  render() {
    const {type, updateOnly: _updateOnly, ...props} = this.props;
    return (
      <FormControl
        type={type === 'textarea' ? 'text' : type}
        as={type === 'textarea' ? 'textarea' : undefined}
        className={type === 'textarea' ? 'textarea' : 'tst-input-base'}
        {...props}
      />
    );
  }
}

export const BaseInput = EnhanceInputWithDisplay(EnhanceInputWithLabel(EnhanceInputWithAddons(BaseInputComponent)));
