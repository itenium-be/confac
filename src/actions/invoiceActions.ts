import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './ActionTypes';
import {success, failure, busyToggle} from './appActions';
import {buildUrl, catchHandler} from './fetch';
import t from '../trans';
import EditInvoiceModel from '../components/invoice/models/EditInvoiceModel';
import { previewInvoice } from './downloadActions';


function cleanViewModel(data: EditInvoiceModel): EditInvoiceModel {
  var invoice = Object.assign({}, data);
  Object.keys(invoice).filter(k => k[0] === '_' && k !== '_id').forEach(k => {
    delete invoice[k];
  });
  return invoice;
}


export function createInvoice(data: EditInvoiceModel, history: any) {
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
        history.push(`/${invoiceType}/${res.body.number}`);

      }, function(err) {
        if (err.res && err.res.text === 'TemplateNotFound') {
          failure(t('invoice.pdfTemplateNotFound'), t('invoice.pdfTemplateNotFoundTitle'));
        } else {
          catchHandler(err);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

function updateInvoiceRequest(data: EditInvoiceModel, successMsg: string | undefined, andGoHome: boolean, history?: any) {
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
          history.push('/' + invoiceType);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}



export function invoiceAction(invoice: EditInvoiceModel, type: 'create' | 'update' | 'preview', history: any) {
  if (type === 'create') {
    return createInvoice(invoice, history);
  } else if (type === 'preview') {
    return previewInvoice(invoice);
  } else if (type === 'update') {
    return updateInvoiceRequest(invoice, undefined, false, history);
  }
  console.log('unknown invoiceAction', type, invoice); // eslint-disable-line
}


export function toggleInvoiceVerify(data: EditInvoiceModel) {
  const successMsg = data.verified ? t('invoice.isNotVerifiedConfirm') : t('invoice.isVerifiedConfirm');
  const newData: EditInvoiceModel | any = {...data, verified: !data.verified};
  return updateInvoiceRequest(newData, successMsg, false); // change andGoHome? also need 'history' from router
}


export function deleteInvoice(invoice: EditInvoiceModel) {
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
