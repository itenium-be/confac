import React from 'react';
import {Table} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {getNonGroupedInvoiceList} from './invoice-list-column-factory';
import {ConfigModel} from '../../config/models/ConfigModel';
import InvoiceListModel from '../models/InvoiceListModel';
import {ListHeader} from '../../controls/table/ListHeader';
import {ListRow} from '../../controls/table/ListRow';
import {ConfacState} from '../../../reducers/app-state';
import {ListFooter} from '../../controls/table/ListFooter';

export const NonGroupedInvoiceTable = ({vm, config}: {vm: InvoiceListModel, config: ConfigModel}) => {
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);
  const invoices = vm.getFilteredInvoices();
  const listConfig = getNonGroupedInvoiceList({
    showOrderNr: config.showOrderNr,
    isQuotation: vm.isQuotation,
    invoicePayDays,
  });

  return (
    <Table size="sm">
      <ListHeader config={listConfig} />
      <tbody>
        {invoices.sort((a, b) => b.number - a.number).map(invoice => (
          <ListRow config={listConfig} model={invoice} key={invoice._id} />
        ))}
      </tbody>
      <ListFooter config={listConfig} models={invoices} isQuotation={vm.isQuotation} />
    </Table>
  );
};
