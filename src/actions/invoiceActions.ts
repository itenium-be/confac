import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './utils/ActionTypes';
import {success, failure, busyToggle} from './appActions';
import {catchHandler} from './utils/fetch';
import {buildUrl} from './utils/buildUrl';
import t from '../trans';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {previewInvoice} from './downloadActions';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';


function cleanViewModel(data: InvoiceModel): InvoiceModel {
  const invoice = {...data};
  Object.keys(invoice).filter(k => k[0] === '_' && k !== '_id').forEach(k => {
    delete invoice[k];
  });
  return invoice as InvoiceModel;
}


export function createInvoice(data: InvoiceModel, history?: any) {
  return dispatch => {
    dispatch(busyToggle());
    request.post(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(cleanViewModel(data))
      .then(res => {
        dispatch({
          type: ACTION_TYPES.INVOICE_UPDATED,
          invoice: res.body,
        });

        const invoiceType = data.isQuotation ? 'quotations' : 'invoices';
        success(t(data.isQuotation ? 'quotation.createConfirm' : 'invoice.createConfirm'));
        if (history) {
          history.push(`/${invoiceType}/${res.body.number}`);
        }

      }, err => {
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

function updateInvoiceRequest(data: InvoiceModel, successMsg: string | undefined, andGoHome: boolean, history?: any) {
  return dispatch => {
    dispatch(busyToggle());
    request.put(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(cleanViewModel(data))
      .then(res => {
        dispatch({
          type: ACTION_TYPES.INVOICE_UPDATED,
          invoice: res.body,
        });

        success(successMsg || t('toastrConfirm'));
        if (andGoHome) {
          const invoiceType = data.isQuotation ? 'quotations' : 'invoices';
          history.push(`/${invoiceType}`);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}



export function invoiceAction(invoice: InvoiceModel, type: 'create' | 'update' | 'preview', history: any) {
  if (type === 'create') {
    return createInvoice(invoice, history);
  } if (type === 'preview') {
    return previewInvoice(invoice);
  } if (type === 'update') {
    return updateInvoiceRequest(invoice, undefined, false, history);
  }
  console.log('unknown invoiceAction', type, invoice); // eslint-disable-line
  return null;
}


export function toggleInvoiceVerify(data: InvoiceModel) {
  const successMsg = data.verified ? t('invoice.isNotVerifiedConfirm') : t('invoice.isVerifiedConfirm');
  const newData: InvoiceModel | any = {...data, verified: !data.verified};
  return updateInvoiceRequest(newData, successMsg, false); // change andGoHome? also need 'history' from router
}


export function deleteInvoice(invoice: InvoiceModel) {
  const {projectMonthId} = invoice;
  return dispatch => {
    dispatch(busyToggle());
    if (projectMonthId) {
      const projectMonth: Partial<ProjectMonthModel> = {
        _id: projectMonthId,
        attachments: invoice.attachments,
      };
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_ATTACHMENTS_UPDATE,
        projectMonth,
      });
    }
    request.delete(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .send({id: invoice._id})
      .then(res => {
        console.log('invoice deleted', invoice); // eslint-disable-line
        dispatch({
          type: ACTION_TYPES.INVOICE_DELETED,
          id: invoice._id,
        });
        success(t(`${invoice.isQuotation ? 'quotation' : 'invoice'}.deleteConfirm`));
        return true;
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
