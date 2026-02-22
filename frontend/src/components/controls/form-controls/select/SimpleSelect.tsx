import {Component} from 'react';
import {EnhanceInputWithLabel} from '../../../enhancers/EnhanceInputWithLabel';
import {SelectItem} from '../../../../models';
import {BaseSelect} from './BaseSelect';


export type SimpleSelectProps = {
  value: any;
  options: string[];
  onChange: (value: string) => void;
  transFn?: (key: string) => string;
  isClearable: boolean;
};


// eslint-disable-next-line react/prefer-stateless-function
class SimpleSelectComponent extends Component<SimpleSelectProps> {
  render() {
    const {transFn, options, value, onChange, isClearable, ...props} = this.props;
    const trans = (transKey: string): string => (transFn ? transFn(transKey) : transKey);

    const opts: SelectItem[] = options.map(itm => ({
      label: trans(itm),
      value: itm,
    }));

    return (
      <BaseSelect
        value={{label: trans(value), value}}
        options={opts}
        onChange={(itm: SelectItem) => onChange(itm.value)}
        isClearable={isClearable}
        isMulti={false}
        {...props}
      />
    );
  }
}

export const SimpleSelect = EnhanceInputWithLabel(SimpleSelectComponent);
