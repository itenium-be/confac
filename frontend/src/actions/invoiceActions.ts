import {api, ApiError} from './utils/api-client';
import {ACTION_TYPES} from './utils/ActionTypes';
import {success, failure, busyToggle} from './appActions';
import {catchHandler} from './utils/fetch';
import t from '../trans';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {AppDispatch} from '../types/redux';


function cleanViewModel(data: InvoiceModel): InvoiceModel {
  const invoice = {...data} as unknown as Record<string, unknown>;
  Object.keys(invoice).filter(k => k[0] === '_' && k !== '_id').forEach(k => {
    delete invoice[k];
  });
  return invoice as unknown as InvoiceModel;
}


export function createInvoice(data: InvoiceModel, navigate?: (path: string) => void) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.post<InvoiceModel>('/invoices', cleanViewModel(data));
      dispatch({
        type: ACTION_TYPES.INVOICE_UPDATED,
        invoice: res.body,
      });

      const invoiceType = data.isQuotation ? 'quotations' : 'invoices';
      success(t(data.isQuotation ? 'quotation.createConfirm' : 'invoice.createConfirm'));
      if (navigate) {
        navigate(`/${invoiceType}/${res.body.number}`);
      }
    } catch (err) {
      const error = err as ApiError;
      if (error.res && error.body && (error.body as {message?: string}).message === 'TemplateNotFound') {
        failure(t('invoice.pdfTemplateNotFound'), t('invoice.pdfTemplateNotFoundTitle'));
      } else {
        catchHandler(error);
      }
    } finally {
      dispatch(busyToggle.off());
    }
  };
}

type ModelsUpdatedResponse = {
  invoice?: InvoiceModel;
  invoices?: InvoiceModel[];
};

export function updateInvoiceRequest(data: InvoiceModel, successMsg: string | undefined | null, andGoHome: boolean, navigate?: (path: string) => void) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.put<ModelsUpdatedResponse>('/invoices', cleanViewModel(data));
      dispatch({
        type: ACTION_TYPES.MODELS_UPDATED,
        payload: res.body,
      });

      if (successMsg !== null) {
        success(successMsg || t('toastrConfirm'));
      }
      if (andGoHome && navigate) {
        const invoiceType = data.isQuotation ? 'quotations' : 'invoices';
        navigate(`/${invoiceType}`);
      }
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}

export const syncCreditNotas = (invoice: InvoiceModel, previousCreditNotas: string[], invoices: InvoiceModel[]) => {
  return (dispatch: AppDispatch) => {
    const removedCreditNota = previousCreditNotas.filter(n => !invoice.creditNotas.includes(n));
    const creditNotaGroup = [...invoice.creditNotas, invoice._id];

    removedCreditNota.forEach(creditnota => {
      const invoiceToUpdate = new InvoiceModel(invoice.config, invoices.find(i => i._id === creditnota));
      if (invoiceToUpdate) {
        invoiceToUpdate.creditNotas = [];
        dispatch(updateInvoiceRequest(invoiceToUpdate, null, false));
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
          dispatch(updateInvoiceRequest(invoiceToUpdate, null, false));
        }
      }
    });
  };
};




export function toggleInvoiceVerify(data: InvoiceModel, toggleBusy = true) {
  return async (dispatch: AppDispatch) => {
    if (toggleBusy)
      dispatch(busyToggle());

    try {
      const res = await api.put<ModelsUpdatedResponse>('/invoices/verify', {id: data._id, status: data.status === 'Paid' ? 'ToPay' : 'Paid'});
      if (res) {
        dispatch({
          type: ACTION_TYPES.MODELS_UPDATED,
          payload: res.body,
        });
      }

      success(data.status === 'Paid' ? t('invoice.isNotVerifiedConfirm') : t('invoice.isVerifiedConfirm'));
    } catch (err) {
      catchHandler(err);
    } finally {
      if (toggleBusy)
        dispatch(busyToggle.off());
    }
  };
}


export function deleteInvoice(invoice: InvoiceModel) {
  const {projectMonth} = invoice;
  return async (dispatch: AppDispatch) => {
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
    try {
      await api.delete('/invoices', {id: invoice._id});
      console.log('invoice deleted', invoice);
      dispatch({
        type: ACTION_TYPES.INVOICE_DELETED,
        id: invoice._id,
      });
      success(t(`${invoice.isQuotation ? 'quotation' : 'invoice'}.deleteConfirm`));
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}

type PeppolResponse = {
  error?: boolean;
  message?: string;
  invoice?: InvoiceModel;
  client?: {_id: string};
};

export function sendToPeppol(invoiceId: string, pdfFileName: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.post<PeppolResponse>(`/invoices/${invoiceId}/peppol`, {pdfFileName});
      const data = res.body;

      if (data.error) {
        failure(data.message || t('invoice.peppolError'), t('invoice.peppolErrorTitle'));
        return;
      }

      if (data.invoice) {
        dispatch({type: ACTION_TYPES.INVOICE_UPDATED, invoice: data.invoice});
      }
      if (data.client) {
        dispatch({type: ACTION_TYPES.CLIENT_UPDATE, client: data.client});
      }

      success(data.message || t('invoice.peppolSuccess'));
    } catch (err) {
      const error = err as ApiError;
      // Handle errors with detailed error information from Billit API
      if (error.status === 500 && error.body?.errors && Array.isArray(error.body.errors) && error.body.errors.length > 0) {
        const errorList = error.body.errors
          .map((e: {Code: string; Description?: string}) => `${e.Code}${e.Description ? `: ${e.Description}` : ''}`)
          .join('\n');
        const errorMsg = `${error.body.message || error.body.error || t('invoice.peppolError')}\n\n${errorList}`;
        failure(errorMsg, t('invoice.peppolErrorTitle'), 5000);
      } else {
        catchHandler(error);
      }
    } finally {
      dispatch(busyToggle.off());
    }
  };
}

export function refreshPeppolStatus(invoiceId: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.post<InvoiceModel & {error?: boolean; message?: string}>(`/invoices/${invoiceId}/peppol/refresh`);
      const invoice = res.body;
      if (invoice.error) {
        failure(invoice.message || t('invoice.peppolError'), t('invoice.peppolErrorTitle'));
        return;
      }
      dispatch({type: ACTION_TYPES.INVOICE_UPDATED, invoice});
      success(t('invoice.peppolStatusRefreshed'));
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}

export function handleInvoiceSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: AppDispatch) => {
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
