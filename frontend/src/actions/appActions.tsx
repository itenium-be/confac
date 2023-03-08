import React from 'react';
import {toast} from 'react-toastify';
import {ACTION_TYPES} from './utils/ActionTypes';
import t from '../trans';
import {InvoiceFilters} from '../models';
import {ListFilters} from '../components/controls/table/table-models';
import {Features} from '../components/controls/feature/feature-models';

type ToastType = 'error' | 'success' | 'info';

function getIcon(type: ToastType): string {
  switch (type) {
    case 'error':
      return 'fa fa-times-circle';
    case 'info':
      return 'fa fa-info-circle';
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


export function success(msg = '', title = '', timeout: number | false = 2000): void {
  toast(
    <ToastMessage msg={msg} title={title || t('toastrSuccessTitle')} type="success" />,
    {autoClose: timeout, position: toast.POSITION.BOTTOM_LEFT},
  );
}


export function failure(msg = '', title = '', timeout: number | false = 4000, position?: any): void {
  toast.error(
    <ToastMessage
      msg={msg || t('toastrFailure')}
      title={title || t('toastrFailureTitle')}
      type="error"
    />,
    {autoClose: timeout, position: (position || toast.POSITION.TOP_CENTER as any)},
  );
}


export function info(msg = ''): void {
  toast.info(
    msg,
    {autoClose: 2800, position: toast.POSITION.TOP_RIGHT, closeButton: false},
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


export function updateAppFilters(featureKey: Features, filters: ListFilters) {
  return {
    type: ACTION_TYPES.APP_FILTERUPDATED,
    payload: {feature: featureKey, filters},
  };
}


export function updateAppProjectMonthsFilter(month: string, opened: boolean) {
  return {
    type: ACTION_TYPES.APP_FILTER_OPEN_MONTHS_UPDATED,
    payload: {month, opened},
  };
}
