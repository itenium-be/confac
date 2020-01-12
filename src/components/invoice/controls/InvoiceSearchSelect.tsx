import React, {Component} from 'react';
import Creatable from 'react-select/creatable';
import {InvoiceFiltersSearch} from '../../../models';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {t} from '../../utils';


type InvoiceSearchSelectProps = {
  options: InvoiceFiltersSearch[],
  value: any,
  onChange: Function,
}


export const InvoiceSearchSelect = EnhanceInputWithLabel(class extends Component<InvoiceSearchSelectProps> {
  onChange(value: InvoiceFiltersSearch[] | null) {
    if (value === null) {
      this.props.onChange([]);
      return;
    }

    // Consider pure int manual input
    // to be search on invoice number
    value.filter(f => !f.type && +f.value).forEach(f => {
      f.type = 'invoice-nr';
      f.value = parseInt(f.value as string, 10);
    });

    // All remaining are pure text searches
    value.filter(f => !f.type).forEach(f => {
      f.type = 'manual_input';
    });

    this.props.onChange(value);
  }

  render() {
    return (
      <Creatable
        value={this.props.value}
        options={this.props.options}
        onChange={this.onChange.bind(this) as any}
        isClearable
        isMulti
        noOptionsMessage={() => t('controls.noResultsText')}
        formatCreateLabel={value => t('controls.addFilterText', {value})}
        placeholder={t('invoice.search.placeholder')}
        className={`tst-${this.props['data-tst']}`}
      />
    );
  }
});
