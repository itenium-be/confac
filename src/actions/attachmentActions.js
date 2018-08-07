import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './ActionTypes.js';
import {success, busyToggle} from './appActions.js';
import {buildUrl, catchHandler} from './fetch.js';


export function buildAttachmentUrl(invoiceOrClient, type) {
  const model = invoiceOrClient.money ? 'invoice' : 'client'; // HACK: dangerous stuff...
  return buildUrl(`/attachments/${model}/${invoiceOrClient._id}/${type}`);
}


export function updateAttachment(model, modelType, {type, file}) {
  return dispatch => {
    dispatch(busyToggle());
    var req = request.put(buildAttachmentUrl(model, type));
      //.set('Content-Type', 'application/json');

    req.attach(file.name, file);

    // file.forEach(f => {
    //   req.attach(f.name, f);
    // });

    req.then(function(res) {
      dispatch({
        type: modelType === 'client' ? ACTION_TYPES.CLIENT_UPDATE : ACTION_TYPES.INVOICE_UPDATED,
        [modelType === 'client' ? 'client' : 'invoice']: res.body
      });

      dispatch(success());
      return true;
    })
    .catch(catchHandler)
    .then(() => dispatch(busyToggle.off()));
  };
}



export function deleteAttachment(model, modelType, {type}) {
  return dispatch => {
    dispatch(busyToggle());
    request.delete(buildAttachmentUrl(model, type))
      .then(function(res) {
        dispatch({
          type: modelType === 'client' ? ACTION_TYPES.CLIENT_UPDATE : ACTION_TYPES.INVOICE_UPDATED,
          [modelType === 'client' ? 'client' : 'invoice']: res.body
        });

        dispatch(success());
        return true;
      })
    .catch(catchHandler)
    .then(() => dispatch(busyToggle.off()));
  };
}
