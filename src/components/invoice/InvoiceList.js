import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {updateInvoiceFilters} from '../../actions/index.js';
import InvoiceListViewModel from './InvoiceListViewModel.js';
import {groupInvoicesPerMonth} from './EditInvoiceViewModel.js';
import t from '../../trans.js';

import {Grid, Table} from 'react-bootstrap';
import {InvoiceListHeader, InvoiceListFooter, InvoiceListRow} from './InvoiceListRow.js';
import {InvoiceSearch} from './controls/InvoiceSearch.js';
import {InvoiceWorkedDays} from './controls/InvoiceWorkedDays.js';
import {InvoicesTotal} from './controls/InvoiceTotal.js';
import {InvoiceAmountLabel} from './controls/InvoicesSummary.js';


function getColumns(fields, showOrderNr) {
  var columns = [{
    key: 'date-month',
    header: t('invoice.date'),
    value: i => i.date.format('MMM YYYY'),
    groupedBy: true,
  }, {
    key: 'number',
    header: t('invoice.numberShort'),
    value: i => i.number,
  }, {
    key: 'client',
    header: t('invoice.client'),
    value: i => i.client.name,
  }, {
    key: 'date-full',
    header: t('invoice.date'),
    value: i => i.date.format('DD/MM/YYYY'),
  }];

  if (showOrderNr) {
    fields.push('orderNr');
    columns.push({
      key: 'orderNr',
      header: t('invoice.orderNrShort'),
      value: i => i.orderNr,
    });
  }

  return columns.filter(col => fields.includes(col.key));
}


class InvoiceList extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    invoices: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    updateInvoiceFilters: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      search: PropTypes.array.isRequired,
      unverifiedOnly: PropTypes.bool.isRequired,
      groupedByMonth: PropTypes.bool.isRequired,
    }),
  }

  render() {
    const vm = new InvoiceListViewModel(this.props.invoices, this.props.clients, this.props.filters);
    const filteredInvoices = vm.getFilteredInvoices();

    // TODO: from React 16 it will be possible to return an array. that
    // would solve the root element problem when returning an array of tbodys
    // --> ie create a InvoiceListGroupedRows component then :)
    const isGrouped = this.props.filters.groupedByMonth;
    return (
      <Grid>
        {isGrouped ? (
          <GroupedInvoiceTable invoices={filteredInvoices} config={this.props.config} />
        ) : (
          <NonGroupedInvoiceTable invoices={filteredInvoices} config={this.props.config} />
        )}

        <InvoiceSearch
          onChange={newFilter => this.props.updateInvoiceFilters(newFilter)}
          filterOptions={vm.getFilterOptions()}
          filters={this.props.filters}
        />
      </Grid>
    );
  }
}

export default connect(state => ({
  invoices: state.invoices,
  clients: state.clients,
  filters: state.app.invoiceFilters,
  config: state.config,
}), {updateInvoiceFilters})(InvoiceList);



const NonGroupedInvoiceTable = ({invoices, config}) => {
  const columns = getColumns(['number', 'client', 'date-full'], config.showOrderNr);
  return (
    <Table condensed style={{marginTop: 10}}>
      <InvoiceListHeader columns={columns} />
      <tbody>
        {invoices.sort((a, b) => b.number - a.number).map(invoice => (
          <InvoiceListRow columns={columns} invoice={invoice} key={invoice._id} />
        ))}
      </tbody>
      <InvoiceListFooter columns={columns} invoices={invoices} />
    </Table>
  );
};


const GroupedInvoiceTable = ({invoices, config}) => {
  const columns = getColumns(['date-month', 'number', 'client'], config.showOrderNr);
  const invoicesPerMonth = groupInvoicesPerMonth(invoices).sort((a, b) => b.key.localeCompare(a.key));


  const hideBorderStyle = {borderBottom: 0, borderTop: 0};

  return (
    <Table condensed style={{marginTop: 10}}>
      <InvoiceListHeader columns={columns} />

      {invoicesPerMonth.map(({key, invoiceList}) => [
        <tbody key={key}>
          {invoiceList.sort((a, b) => b.number - a.number).map((invoice, index) => (
            <InvoiceListRow columns={columns} invoice={invoice} key={invoice._id} isFirstRow={index === 0} onlyRowForMonth={invoiceList.length === 1} />
          ))}
        </tbody>,
        invoiceList.length > 1 ? <tbody key={key + '-group-row'} style={hideBorderStyle}>
          <tr style={{...hideBorderStyle, height: 60}}>
            <td style={hideBorderStyle}>&nbsp;</td>
            <td colSpan={columns.length - 1}><strong><InvoiceAmountLabel invoices={invoiceList} /></strong></td>
            <td><strong><InvoiceWorkedDays invoices={invoiceList} /></strong></td>
            <td><InvoicesTotal invoices={invoiceList} totalOnly /></td>
            <td>&nbsp;</td>
          </tr>
        </tbody> : null
      ])}

      <InvoiceListFooter columns={columns} invoices={invoices} />
    </Table>
  );
};
