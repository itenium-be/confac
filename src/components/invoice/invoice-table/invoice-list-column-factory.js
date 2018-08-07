import t from '../../../trans.js';

export function getColumns(fields, showOrderNr, isQuotation) {
  const transPrefix = isQuotation ? 'quotation' : 'invoice';
  var columns = [{
    key: 'date-month',
    header: t(transPrefix + '.date'),
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
    header: t(transPrefix + '.date'),
    value: i => i.date.format('DD/MM/YYYY'),
  }];

  if (showOrderNr) {
    fields.push('orderNr');
    columns.push({
      key: 'orderNr',
      header: t(transPrefix + '.orderNrShort'),
      value: i => i.orderNr,
    });
  }

  return columns.filter(col => fields.includes(col.key));
}
