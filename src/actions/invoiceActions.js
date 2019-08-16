import request from 'superagent-bluebird-promise';
import {browserHistory} from 'react-router';

import {ACTION_TYPES} from './ActionTypes.js';
import {success, failure, busyToggle} from './appActions.js';
import {buildUrl, catchHandler} from './fetch.js';
import t from '../trans.js';
import {previewInvoice} from './downloadActions.js';


function cleanViewModel(data) {
  var invoice = Object.assign({}, data);
  Object.keys(invoice).filter(k => k[0] === '_' && k !== '_id').forEach(k => {
    delete invoice[k];
  });
  return invoice;
}


export function createInvoice(data) {
  return dispatch => {
    dispatch(busyToggle());
    request.post(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(cleanViewModel(data))
      .then(function(res) {
        dispatch({
          type: ACTION_TYPES.INVOICE_ADDED,
          invoice: res.body
        });

        const invoiceType = data.isQuotation ? 'quotation': 'invoice';
        success(t(invoiceType + '.createConfirm'));
        browserHistory.push(`/${invoiceType}/${res.body.number}`);

      }, function(err) {
        if (err.res && err.res.text === 'TemplateNotFound') {
          failure(t('invoice.pdfTemplateNotFoundTitle'), t('invoice.pdfTemplateNotFound'));
        } else {
          catchHandler(err);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

function updateInvoiceRequest(data, successMsg, andGoHome) {
  return dispatch => {
    dispatch(busyToggle());
    request.put(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(cleanViewModel(data))
      .then(function(res) {
        dispatch({
          type: ACTION_TYPES.INVOICE_UPDATED,
          invoice: res.body
        });

        success(successMsg || t('toastrConfirm'));
        if (andGoHome) {
          const invoiceType = data.isQuotation ? 'quotations' : 'invoices';
          browserHistory.push('/' + invoiceType);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export function invoiceAction(invoice, type) {
  if (type === 'create') {
    return createInvoice(invoice);
  } else if (type === 'preview') {
    return previewInvoice(invoice);
  } else if (type === 'update') {
    return updateInvoice(invoice);
  }
  console.log('unknown invoiceAction', type, invoice); // eslint-disable-line
}

export function updateInvoice(data) {
  return updateInvoiceRequest(data, undefined, true);
}

export function toggleInvoiceVerify(data) {
  const successMsg = data.verified ? t('invoice.isNotVerifiedConfirm') : t('invoice.isVerifiedConfirm');
  const newData = {...data, verified: !data.verified};
  return updateInvoiceRequest(newData, successMsg, false);
}


export function deleteInvoice(invoice) {
  return dispatch => {
    dispatch(busyToggle());
    request.delete(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .send({id: invoice._id})
      .then(function(res) {
        console.log('invoice deleted', invoice); // eslint-disable-line
        dispatch({
          type: ACTION_TYPES.INVOICE_DELETED,
          id: invoice._id
        });
        success(t((invoice.isQuotation ? 'quotation' : 'invoice') + '.deleteConfirm'));
        return true;
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
