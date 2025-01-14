import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './utils/ActionTypes';
import {success, failure, busyToggle} from './appActions';
import {catchHandler} from './utils/fetch';
import {buildUrl} from './utils/buildUrl';
import t from '../trans';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';
import {authService} from '../components/users/authService';
import { socketService } from '../components/socketio/SocketService';
import { EntityEventPayload } from '../components/socketio/EntityEventPayload';
import { SocketEventTypes } from '../components/socketio/SocketEventTypes';
import { Dispatch } from 'redux';


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

export function updateInvoiceRequest(data: InvoiceModel, successMsg: string | undefined, andGoHome: boolean, navigate?: any) {
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

        success(successMsg || t('toastrConfirm'));
        if (andGoHome) {
          const invoiceType = data.isQuotation ? 'quotations' : 'invoices';
          navigate(`/${invoiceType}`);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}



export function toggleInvoiceVerify(data: InvoiceModel) {
  const successMsg = data.verified ? t('invoice.isNotVerifiedConfirm') : t('invoice.isVerifiedConfirm');
  const newData: InvoiceModel | any = {...data, verified: !data.verified};
  return updateInvoiceRequest(newData, successMsg, false); // change andGoHome? also need 'navigate' from router
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

export function handleInvoiceSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: Dispatch) => {
    switch(eventType) {
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
  }
}
