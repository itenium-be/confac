import {t} from '../../utils';
import {SimpleSelect} from '../../controls/form-controls/select/SimpleSelect';
import {invoiceDateStrategies} from '../models/invoice-date-strategy';
import {InvoiceDateStrategy} from '../../../models';


type InvoiceDateStrategySelectProps = {
  value: InvoiceDateStrategy,
  onChange: Function,
}

export const InvoiceDateStrategySelect = ({value = 'prev-month-last-day', ...props}: InvoiceDateStrategySelectProps) => (
  <SimpleSelect
    transFn={(key: string) => t(`invoice.dateStrategies.${key}`)}
    value={value}
    options={invoiceDateStrategies}
    isClearable={false}
    placeholder=""
    {...props}
    label={t('config.defaultInvoiceDateStrategy')}
  />
);
