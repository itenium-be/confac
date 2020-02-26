import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './utils/ActionTypes';
import {success, busyToggle} from './appActions';
import {buildUrl, catchHandler} from './utils/fetch';
import {IAttachment} from '../models';


function buildAttachmentUrl(invoiceOrClient: IAttachment, type: 'pdf' | string) {
  // eslint-disable-next-line dot-notation
  const model = invoiceOrClient['money'] ? 'invoice' : 'client'; // HACK: dangerous stuff...
  return buildUrl(`/attachments/${model}/${invoiceOrClient._id}/${type}`);
}


export function updateAttachment(
  model: IAttachment,
  modelType: 'client' | 'invoice' | 'quotation',
  {type, file}: {type: string, file: any},
) {
  return dispatch => {
    dispatch(busyToggle());
    const req = request.put(buildAttachmentUrl(model, type));
    // .set('Content-Type', 'application/json');

    req.attach(file.name, file);

    // file.forEach(f => {
    //   req.attach(f.name, f);
    // });

    req.then(res => {
      dispatch({
        type: modelType === 'client' ? ACTION_TYPES.CLIENT_UPDATE : ACTION_TYPES.INVOICE_UPDATED,
        [modelType === 'client' ? 'client' : 'invoice']: res.body, // ATTN: quotation is saved like an invoice
      });

      success();
      return true;
    })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}



export function deleteAttachment(model: IAttachment, modelType: 'client' | 'invoice' | 'quotation', type: string) {
  return dispatch => {
    dispatch(busyToggle());
    request.delete(buildAttachmentUrl(model, type))
      .then(res => {
        dispatch({
          type: modelType === 'client' ? ACTION_TYPES.CLIENT_UPDATE : ACTION_TYPES.INVOICE_UPDATED,
          [modelType === 'client' ? 'client' : 'invoice']: res.body,
        });

        success();
        return true;
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
