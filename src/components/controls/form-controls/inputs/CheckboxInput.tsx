import React, {Component} from 'react';
import {/* EnhanceInputWithLabel, */EnhanceInputWithLabelProps} from '../../../enhancers/EnhanceInputWithLabel';

export type BaseInputProps<TReturn> = EnhanceInputWithLabelProps & {
  value?: boolean,
  onChange: (e: TReturn) => void,
  style?: React.CSSProperties,
}

export const CheckboxInput = /* EnhanceInputWithLabel( */class extends Component<BaseInputProps<any>> {
  render() {
    const {value, label, onChange, ...props} = this.props;
    return (
      <div style={{marginBottom: 5}}>
        <input
          type="checkbox"
          checked={value || false}
          onChange={(evt) => onChange(evt.target.checked)}
          {...props}
        />
        <span style={{paddingLeft: 10}}>{label}</span>
      </div>
    );
  }
}/* ) */;
