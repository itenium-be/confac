import React from 'react';
import request from 'superagent-bluebird-promise';

import {ACTION_TYPES} from './ActionTypes.js';
import {buildUrl, catchHandler} from './fetch.js';
import { toast } from 'react-toastify';
import t from '../trans.js';

function getIcon(type) {
  switch (type) {
  case 'error':
    return 'fa fa-times-circle';
  case 'success':
  default:
    return 'fa fa-check-circle';
  }
}

const ToastMessage = ({ closeToast, msg, title, type }) => (
  <div className={'reapop ' + type}>
    <div className="icon">
      <i className={getIcon(type)} />
    </div>
    <div className="content">
      <b>{title}</b>
      <p>{msg}</p>
    </div>
  </div>
);


export function success(msg, title, timeout = 2000) {
  toast(
    <ToastMessage msg={msg} title={t('toastrSuccessTitle')} type="success" />,
    { autoClose: timeout, position: toast.POSITION.BOTTOM_RIGHT }
  );
}


export function failure(msg, title, timeout = 4000) {
  toast.error(
    <ToastMessage
      msg={msg || t('toastrFailure')}
      title={title || t('toastrFailureTitle')}
      type="error"
    />,
    { autoClose: timeout, position: toast.POSITION.TOP_CENTER }
  );
}



export function busyToggle() {
  return {type: ACTION_TYPES.APP_BUSYTOGGLE, why: 'moreBusy'};
}
busyToggle.off = function() {
  return {type: ACTION_TYPES.APP_BUSYTOGGLE, why: 'lessBusy'};
};


export function updateConfig(newConfig) {
  return dispatch => {
    dispatch(busyToggle());
    return request.post(buildUrl('/config'))
      .set('Content-Type', 'application/json')
      .send(newConfig)
      .then(res => {
        dispatch({type: ACTION_TYPES.CONFIG_UPDATE, config: res.body});
        success(t('config.popupMessage'));
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export function updateInvoiceFilters(filters) {
  return {
    type: ACTION_TYPES.APP_INVOICE_FILTERSUPDATED,
    filters
  };
}

export function saveClient(client, stayOnPage = false, callback = null) {
  return dispatch => {
    dispatch(busyToggle());
    return request.post(buildUrl('/clients'))
      .set('Content-Type', 'application/json')
      .send(client)
      .then(res => {
        dispatch({
          type: ACTION_TYPES.CLIENT_UPDATE,
          client: res.body,
          isNewClient: !client._id
        });
        success(t('config.popupMessage'));
        if (!stayOnPage) {
          window.history.back();
        }
        if (callback) {
          callback(res.body);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
