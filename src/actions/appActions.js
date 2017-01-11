import request from 'superagent';
import { buildUrl } from './fetch';
import { addNotification as notify } from 'reapop';
import t from '../trans.js';

export const notifySettings = {
  status: 'success',
  position: 'bc',
  dismissible: true,
  dismissAfter: 4000,
  closeButton: true,
  allowHTML: false,
};

export function success(msg) {
  return notify({
    status: 'success',
    title: t('toastrSuccessTitle'),
    message: msg
  });
}

export function updateConfig(newConfig) {
  return dispatch => {
    return request.post(buildUrl('/config'))
      .set('Content-Type', 'application/json')
      .send(newConfig)
      .end(() => {
        dispatch(success(t('config.popupMessage')));
      });
  };
}
