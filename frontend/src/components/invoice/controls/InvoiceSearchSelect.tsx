import {Component} from 'react';
import Creatable from 'react-select/creatable';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {t} from '../../utils';
import {InvoiceFiltersSearch} from '../../controls/table/table-models';


type InvoiceSearchSelectProps = {
  options: InvoiceFiltersSearch[];
  value: any;
  onChange: Function;
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
      // eslint-disable-next-line no-param-reassign
      f.type = 'invoice-nr';
      // eslint-disable-next-line no-param-reassign
      f.value = parseInt(f.value as string, 10);
    });

    // All remaining are pure text searches
    value.filter(f => !f.type).forEach(f => {
      // eslint-disable-next-line no-param-reassign
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
        classNamePrefix="react-select"
        className="react-select-invoice"
      />
    );
  }
});
