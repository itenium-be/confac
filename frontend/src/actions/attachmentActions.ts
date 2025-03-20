import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './utils/ActionTypes';
import {success, busyToggle} from './appActions';
import {catchHandler} from './utils/fetch';
import {buildUrl} from './utils/buildUrl';
import {IAttachment} from '../models';
import {authService} from '../components/users/authService';


function buildAttachmentUrl(invoiceOrClient: IAttachment, type: 'pdf' | string) {
  // eslint-disable-next-line dot-notation
  const model = invoiceOrClient['money'] ? 'invoice' : 'client'; // HACK: dangerous stuff...
  return buildUrl(`/attachments/${model}/${invoiceOrClient._id}/${type}`);
}


/**
 * DO NOT USE:
 * IAttachment is implemented by InvoiceModel
 * This was a bad idea.
 **/
export function updateAttachment(
  model: IAttachment,
  modelType: 'client' | 'invoice' | 'quotation',
  {type, file}: {type: string, file: File},
) {
  return dispatch => {
    dispatch(busyToggle());
    const req = request
      .put(buildAttachmentUrl(model, type))
      .set('Authorization', authService.getBearer());

    req.attach(file.name, file);

    // Multiple files?
    // file.forEach(f => { req.attach(f.name, f); });

    req.then(res => {
      let config: {type: string, key: string};
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
      dispatch({ type: config.type, [config.key]: mergedModel });
      success();
      return true;
    })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export type ModelsWithAttachments = 'client' | 'invoice' | 'quotation' | 'config';

export type AttachmentFormContext = {
  modelType: ModelsWithAttachments,
  id: string,
  attachmentType: 'pdf' | string;
}


function getDispatchConfig(modelType: ModelsWithAttachments, body: any): any {
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
  const url = buildUrl(`/attachments/${context.modelType}/${context.id}/${context.attachmentType}`);
  return dispatch => {
    dispatch(busyToggle());
    const req = request
      .put(url)
      .set('Authorization', authService.getBearer());

    req.attach(file.name, file);

    req.then(res => {
      const config = getDispatchConfig(context.modelType, res.body);
      dispatch(config);

      success();
      return true;
    })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}




export function deleteGenericAttachment(context: AttachmentFormContext) {
  const url = buildUrl(`/attachments/${context.modelType}/${context.id}/${context.attachmentType}`);
  return dispatch => {
    dispatch(busyToggle());
    request.delete(url)
      .set('Authorization', authService.getBearer())
      .then(res => {
        const config = getDispatchConfig(context.modelType, res.body);
        dispatch(config);

        success();
        return true;
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}



/** DO NOT USE */
export function deleteAttachment(model: IAttachment, modelType: 'client' | 'invoice' | 'quotation', type: string) {
  return dispatch => {
    dispatch(busyToggle());
    request.delete(buildAttachmentUrl(model, type))
      .set('Authorization', authService.getBearer())
      .then(res => {
        const mergedModel = {...model, attachments: res.body.attachments};
        dispatch({
          type: modelType === 'client' ? ACTION_TYPES.CLIENT_UPDATE : ACTION_TYPES.INVOICE_UPDATED,
          [modelType === 'client' ? 'client' : 'invoice']: mergedModel,
        });

        success();
        return true;
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
