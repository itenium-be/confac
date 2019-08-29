import React, {Component} from 'react';
import {FormControl} from 'react-bootstrap';
import {EnhanceInputWithLabel} from '../../../enhancers/EnhanceInputWithLabel';
import {EnhanceInputWithAddons, EnhanceInputWithAddonsProps} from '../../../enhancers/EnhanceInputWithAddons';

export type BaseInputProps = EnhanceInputWithAddonsProps & {
  label?: string,
  type?: string,
  value?: any,
  onChange: (e: any) => void,
  onBlur?: (e: any) => void,
  style?: React.CSSProperties,
  placeholder?: string,
}

export const BaseInput = EnhanceInputWithLabel(EnhanceInputWithAddons(class extends Component<BaseInputProps> {
  render() {
    const {type} = this.props;
    return (
      <FormControl
        type={type === 'textarea' ? 'text' : type}
        as={type === 'textarea' ? 'textarea' : undefined}
        className={type === 'textarea' ? 'textarea' : undefined}
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        style={this.props.style}
        data-tst={this.props['data-tst']}
      />
    );
  }
}));
