import {useSelector} from 'react-redux';
import {createInvoiceList} from '../models/getInvoiceFeature';
import {ConfigModel} from '../../config/models/ConfigModel';
import InvoiceListModel from '../models/InvoiceListModel';
import {ConfacState} from '../../../reducers/app-state';
import {List} from '../../controls/table/List';

export const NonGroupedInvoiceTable = ({vm, config}: {vm: InvoiceListModel, config: ConfigModel}) => {
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);
  const invoices = vm.getFilteredInvoices();
  const featureConfig = createInvoiceList({
    isQuotation: vm.isQuotation,
    invoicePayDays,
    isGroupedOnMonth: false,
    data: invoices,
  });

  return <List feature={featureConfig} />;
};
