import React from 'react';

import {toast} from 'react-toastify';
import {ACTION_TYPES} from './utils/ActionTypes';
import t from '../trans';
import {InvoiceFilters, ProjectFilters} from '../models';

type ToastType = 'error' | 'success';

function getIcon(type: ToastType): string {
  switch (type) {
    case 'error':
      return 'fa fa-times-circle';
    case 'success':
    default:
      return 'fa fa-check-circle';
  }
}

type ToastMessageProps = {
  msg: string,
  title: string,
  type: ToastType,
}

const ToastMessage = ({msg, title, type}: ToastMessageProps) => (
  <div className={`reapop ${type}`}>
    <div className="icon">
      <i className={getIcon(type)} />
    </div>
    <div className="content">
      <b>{title}</b>
      <p>{msg}</p>
    </div>
  </div>
);


export function success(msg = '', title = '', timeout = 2000): void {
  toast(
    <ToastMessage msg={msg} title={title || t('toastrSuccessTitle')} type="success" />,
    {autoClose: timeout, position: toast.POSITION.BOTTOM_RIGHT},
  );
}


export function failure(msg = '', title = '', timeout = 4000, position?: Position): void {
  toast.error(
    <ToastMessage
      msg={msg || t('toastrFailure')}
      title={title || t('toastrFailureTitle')}
      type="error"
    />,
    {autoClose: timeout, position: (position || toast.POSITION.TOP_CENTER as any)},
  );
}



export function busyToggle() {
  return {type: ACTION_TYPES.APP_BUSYTOGGLE, why: 'moreBusy'};
}
busyToggle.off = () => ({type: ACTION_TYPES.APP_BUSYTOGGLE, why: 'lessBusy'});


export function updateInvoiceFilters(filters: InvoiceFilters) {
  return {
    type: ACTION_TYPES.APP_INVOICE_FILTERSUPDATED,
    filters,
  };
}

export function updateProjectFilters(filters: ProjectFilters) {
  return {
    type: ACTION_TYPES.APP_PROJECT_FILTERUPDATED,
    filters,
  };
}
