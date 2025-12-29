import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './utils/ActionTypes';
import {success, failure, busyToggle} from './appActions';
import {catchHandler} from './utils/fetch';
import {buildUrl} from './utils/buildUrl';
import t from '../trans';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';
import {authService} from '../components/users/authService';
import {socketService} from '../components/socketio/SocketService';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {Dispatch} from 'redux';


function cleanViewModel(data: InvoiceModel): InvoiceModel {
  const invoice = {...data};
  Object.keys(invoice).filter(k => k[0] === '_' && k !== '_id').forEach(k => {
    delete invoice[k];
  });
  return invoice as InvoiceModel;
}


export function createInvoice(data: InvoiceModel, navigate?: any) {
  return dispatch => {
    dispatch(busyToggle());
    request.post(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .set('Accept', 'application/json')
      .send(cleanViewModel(data))
      .then(res => {
        dispatch({
          type: ACTION_TYPES.INVOICE_UPDATED,
          invoice: res.body,
        });

        const invoiceType = data.isQuotation ? 'quotations' : 'invoices';
        success(t(data.isQuotation ? 'quotation.createConfirm' : 'invoice.createConfirm'));
        if (navigate) {
          navigate(`/${invoiceType}/${res.body.number}`);
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

export function updateInvoiceRequest(data: InvoiceModel, successMsg: string | undefined | null, andGoHome: boolean, navigate?: any) {
  return dispatch => {
    dispatch(busyToggle());
    request.put(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .set('Accept', 'application/json')
      .send(cleanViewModel(data))
      .then(res => {
        dispatch({
          type: ACTION_TYPES.MODELS_UPDATED,
          payload: res.body,
        });

        if (successMsg !== null) {
          success(successMsg || t('toastrConfirm'));
        }
        if (andGoHome) {
          const invoiceType = data.isQuotation ? 'quotations' : 'invoices';
          navigate(`/${invoiceType}`);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export const syncCreditNotas = (invoice: InvoiceModel, previousCreditNotas: string[], invoices: InvoiceModel[]) => {
  return dispatch => {
    const removedCreditNota = previousCreditNotas.filter(n => !invoice.creditNotas.includes(n));
    const creditNotaGroup = [...invoice.creditNotas, invoice._id];

    removedCreditNota.forEach(creditnota => {
      const invoiceToUpdate = new InvoiceModel(invoice.config, invoices.find(i => i._id === creditnota));
      if (invoiceToUpdate) {
        invoiceToUpdate.creditNotas = [];
        dispatch(updateInvoiceRequest(invoiceToUpdate, null, false) as any);
      }
    });

    invoice.creditNotas.forEach(creditNota => {
      const invoiceToUpdate = new InvoiceModel(invoice.config, invoices.find(i => i._id === creditNota));
      if (invoiceToUpdate) {
        const newCreditNotas = creditNotaGroup.filter(n => n !== invoiceToUpdate._id);

        if (newCreditNotas.length !== invoiceToUpdate.creditNotas.length ||
          !(newCreditNotas.every(id => invoiceToUpdate.creditNotas.includes(id)) &&
          invoiceToUpdate.creditNotas.every(id => newCreditNotas.includes(id)))
        ) {
          invoiceToUpdate.creditNotas = newCreditNotas;
          dispatch(updateInvoiceRequest(invoiceToUpdate, null, false) as any);
        }
      }
    });
  };
};




export function toggleInvoiceVerify(data: InvoiceModel, toggleBusy = true) {
  return dispatch => {
    if (toggleBusy)
      dispatch(busyToggle());

    request.put(buildUrl('/invoices/verify'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .set('Accept', 'application/json')
      .send({id: data._id, status: data.status === 'Paid' ? 'ToPay' : 'Paid'})
      .then(res => {
        if (res) {
          dispatch({
            type: ACTION_TYPES.MODELS_UPDATED,
            payload: res.body,
          });
        }

        success(data.status === 'Paid' ? t('invoice.isNotVerifiedConfirm') : t('invoice.isVerifiedConfirm'));
      })
      .catch(catchHandler)
      .then(() => {
        if (toggleBusy)
          dispatch(busyToggle.off());
      });
  };
}


export function deleteInvoice(invoice: InvoiceModel) {
  const {projectMonth} = invoice;
  return dispatch => {
    dispatch(busyToggle());
    if (projectMonth) {
      const deleteModel: Partial<ProjectMonthModel> = {
        _id: projectMonth.projectMonthId,
        attachments: invoice.attachments,
      };
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_ATTACHMENTS_UPDATE,
        projectMonth: deleteModel,
      });
    }
    request.delete(buildUrl('/invoices'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
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

export function sendToPeppol(invoiceId: string, pdfFileName: string) {
  return (dispatch: Dispatch) => {
    dispatch(busyToggle());
    request.post(buildUrl(`/invoices/${invoiceId}/peppol`))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .set('Accept', 'application/json')
      .send({pdfFileName})
      .then(res => {
        const data = res.body;

        // Check for errors in the response
        if (data.error) {
          failure(data.message || t('invoice.peppolError'), t('invoice.peppolErrorTitle'));
          return;
        }

        success(data.message || t('invoice.peppolSuccess'));
      }, err => {
        catchHandler(err);
      })
      .finally(() => dispatch(busyToggle()));
  };
}

export function handleInvoiceSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: Dispatch) => {
    switch (eventType) {
      case SocketEventTypes.EntityUpdated:
      case SocketEventTypes.EntityCreated:
        dispatch({
          type: ACTION_TYPES.INVOICE_UPDATED,
          invoice: eventPayload.entity
        });
        break;
      case SocketEventTypes.EntityDeleted:
        dispatch({
          type: ACTION_TYPES.INVOICE_DELETED,
          id: eventPayload.entityId,
        });
        break;
      default:
        throw new Error(`${eventType} not supported for project month.`);
    }
  };
}
