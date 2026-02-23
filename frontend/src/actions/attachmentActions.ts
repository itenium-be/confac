import {api} from './utils/api-client';
import {ACTION_TYPES} from './utils/ActionTypes';
import {success, busyToggle} from './appActions';
import {catchHandler} from './utils/fetch';
import {IAttachment} from '../models';
import {AppDispatch} from '../types/redux';


function buildAttachmentUrl(invoiceOrClient: IAttachment, type: 'pdf' | string) {
  const model = (invoiceOrClient as unknown as Record<string, unknown>).money ? 'invoice' : 'client'; // HACK: dangerous stuff...
  return `/attachments/${model}/${invoiceOrClient._id}/${type}`;
}


/**
 * DO NOT USE:
 * IAttachment is implemented by InvoiceModel
 * This was a bad idea.
 **/
export function updateAttachment(
  model: IAttachment,
  modelType: 'client' | 'invoice' | 'quotation',
  {type, file}: {type: string; file: File},
) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.upload<{attachments: unknown[]}>(buildAttachmentUrl(model, type), file.name, file);

      let config: {type: string; key: string};
      switch (modelType) {
        case 'client':
          config = {type: ACTION_TYPES.CLIENT_UPDATE, key: 'client'};
          break;
        case 'invoice':
        case 'quotation':
          config = {type: ACTION_TYPES.INVOICE_UPDATED, key: 'invoice'};
          break;
      }

      const mergedModel = {...model, attachments: res.body.attachments};
      dispatch({type: config.type, [config.key]: mergedModel});
      success();
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}

export type ModelsWithAttachments = 'client' | 'invoice' | 'quotation' | 'config';

export type AttachmentFormContext = {
  modelType: ModelsWithAttachments;
  id: string;
  attachmentType: 'pdf' | string;
}


type DispatchConfig = {type: string; config?: unknown; client?: unknown; invoice?: unknown};

function getDispatchConfig(modelType: ModelsWithAttachments, body: unknown): DispatchConfig {
  switch (modelType) {
    case 'config':
      return {type: ACTION_TYPES.CONFIG_UPDATE, config: body};

    case 'client':
      return {type: ACTION_TYPES.CLIENT_UPDATE, client: body};

    case 'invoice':
    case 'quotation':
      return {type: ACTION_TYPES.INVOICE_UPDATED, invoice: body};
  }
}


export function updateGenericAttachment(context: AttachmentFormContext, file: File) {
  const url = `/attachments/${context.modelType}/${context.id}/${context.attachmentType}`;
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.upload(url, file.name, file);
      const config = getDispatchConfig(context.modelType, res.body);
      dispatch(config);
      success();
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}




export function deleteGenericAttachment(context: AttachmentFormContext) {
  const url = `/attachments/${context.modelType}/${context.id}/${context.attachmentType}`;
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.delete(url);
      const config = getDispatchConfig(context.modelType, res.body);
      dispatch(config);
      success();
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}



/** DO NOT USE */
export function deleteAttachment(model: IAttachment, modelType: 'client' | 'invoice' | 'quotation', type: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.delete<{attachments: unknown[]}>(buildAttachmentUrl(model, type));
      const mergedModel = {...model, attachments: res.body.attachments};
      dispatch({
        type: modelType === 'client' ? ACTION_TYPES.CLIENT_UPDATE : ACTION_TYPES.INVOICE_UPDATED,
        [modelType === 'client' ? 'client' : 'invoice']: mergedModel,
      });
      success();
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}
