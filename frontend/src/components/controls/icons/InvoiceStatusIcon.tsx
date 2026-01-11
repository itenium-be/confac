import {CSSProperties} from 'react';
import {connect, useSelector} from 'react-redux';
import moment from 'moment';
import {IconProps, Icon} from '../Icon';
import {ConfacState} from '../../../reducers/app-state';
import {EnhanceWithBusySpinner} from '../../enhancers/EnhanceWithBusySpinner';
import InvoiceModel, {InvoiceStatus, InvoiceBillitModel} from '../../invoice/models/InvoiceModel';
import t from '../../../trans';

type InvoiceStatusIconProps = IconProps & {
  invoice: InvoiceModel;
  style?: CSSProperties;
}

type IconConfig = {icon: string; color: string; translationKey: string};

export const statusConfig: Record<InvoiceStatus, IconConfig> = {
  Draft: {icon: 'far fa-clipboard', color: 'black', translationKey: 'invoice.status.Draft'},
  ToSend: {icon: 'far fa-paper-plane', color: 'black', translationKey: 'invoice.status.ToSend'},
  ToPay: {icon: 'far fa-clock', color: 'black', translationKey: 'invoice.status.ToPay'},
  Paid: {icon: 'far fa-check-circle', color: 'green', translationKey: 'invoice.status.Paid'},
};

/** Get color based on Peppol delivery status for ToPay invoices */
function getPeppolDeliveryColor(billit?: InvoiceBillitModel): string {
  if (!billit?.delivery) {
    // No billit data = red (not sent via Peppol)
    return 'red';
  }
  if (billit.delivery.delivered) {
    return 'black';
  }
  // Check delivery status for pending/sending
  const status = billit.delivery.status?.toLowerCase() || '';
  if (status.includes('pending') || status.includes('sending') || status.includes('processing')) {
    return 'orange';
  }
  // Not delivered and not pending = failed/error
  return 'red';
}

/** Get Peppol status text for tooltip */
export function getPeppolStatusText(billit?: InvoiceBillitModel): string {
  if (!billit?.delivery) {
    return t('invoice.peppolNotSent');
  }
  return billit.delivery.status || (billit.delivery.delivered ? t('invoice.peppolDelivered') : t('invoice.peppolSending'));
}

type TooltipOptions = {
  daysPassed?: number;
  showClickAction?: boolean;
  /** When true, Peppol info is hidden from tooltip */
  isBeforePeppolPivot?: boolean;
}

/** Get tooltip text including Peppol delivery status */
export function getInvoiceStatusTooltip(status: InvoiceStatus, billit?: InvoiceBillitModel, options?: TooltipOptions): string {
  const baseTooltip = t(statusConfig[status].translationKey);

  if (status === 'ToPay') {
    const lines = [baseTooltip];
    // Only show Peppol info for invoices after the Peppol pivot date
    if (!options?.isBeforePeppolPivot) {
      const peppolStatus = getPeppolStatusText(billit);
      lines.push(`Peppol: ${peppolStatus}`);
    }
    if (options?.daysPassed !== undefined) {
      lines.push(t('invoice.outstandingDays', {days: options.daysPassed}));
    }
    if (options?.showClickAction) {
      lines.push('<br>' + t('invoice.clickToMarkPaid'));
    }
    return lines.join('<br>');
  }

  if (status === 'Paid' && options?.showClickAction) {
    return t('invoice.clickToMarkToPay');
  }

  return baseTooltip;
}

export const InvoiceStatusIcon = ({invoice, title, style, ...props}: InvoiceStatusIconProps) => {
  const appConfig = useSelector((state: ConfacState) => state.config);
  const status = invoice.status;
  const billit = invoice.billit;
  const config = statusConfig[status];

  const daysPassed = invoice.audit?.createdOn ? moment().diff(invoice.audit.createdOn, 'days') : undefined;
  const isBeforePeppolPivot = invoice.audit?.createdOn
    ? moment(invoice.audit.createdOn).isBefore(appConfig.peppolPivotDate, 'day')
    : false;

  // For invoices before Peppol pivot date, always use black color
  const color = isBeforePeppolPivot ? config.color : (status === 'ToPay' ? getPeppolDeliveryColor(billit) : config.color);
  const tooltip = title || getInvoiceStatusTooltip(status, billit, {daysPassed, isBeforePeppolPivot});
  return (
    <Icon
      className={`tst-invoice-status-${status.toLowerCase()}`}
      fa={config.icon}
      color={color}
      title={tooltip}
      {...props}
      style={style}
    />
  );
};

type BusyInvoiceStatusIconProps = IconProps & {
  model: InvoiceModel;
}

const BaseStatusIcon = ({model, peppolPivotDate, ...props}: BusyInvoiceStatusIconProps & {peppolPivotDate?: moment.Moment}) => {
  const status = model?.status || 'Draft';
  const config = statusConfig[status];

  const isBeforePeppolPivot = model?.audit?.createdOn
    ? moment(model.audit.createdOn).isBefore(peppolPivotDate, 'day')
    : false;

  // For invoices before Peppol pivot date, always use black color
  const color = isBeforePeppolPivot ? config.color : (status === 'ToPay' ? getPeppolDeliveryColor(model?.billit) : config.color);
  return (
    <Icon
      className={`tst-invoice-status-${status.toLowerCase()}`}
      fa={config.icon}
      color={color}
      {...props}
    />
  );
};

export const BusyInvoiceStatusIcon = connect((state: ConfacState) => ({
  isBusy: state.app.isBusy,
  peppolPivotDate: state.config.peppolPivotDate,
}))(EnhanceWithBusySpinner(BaseStatusIcon));
