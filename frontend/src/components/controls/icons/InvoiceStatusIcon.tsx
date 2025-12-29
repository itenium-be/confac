import {connect} from 'react-redux';
import {IconProps, Icon} from '../Icon';
import {ConfacState} from '../../../reducers/app-state';
import {EnhanceWithBusySpinner} from '../../enhancers/EnhanceWithBusySpinner';
import InvoiceModel, {InvoiceStatus} from '../../invoice/models/InvoiceModel';
import t from '../../../trans';

type InvoiceStatusIconProps = IconProps & {
  status: InvoiceStatus;
}

export const statusConfig: Record<InvoiceStatus, {icon: string; color: string; translationKey: string}> = {
  Draft: {icon: 'fa fa-file', color: 'gray', translationKey: 'invoice.status.draft'},
  ToSend: {icon: 'fa fa-paper-plane', color: 'orange', translationKey: 'invoice.status.toSend'},
  ToPay: {icon: 'fa fa-clock', color: 'blue', translationKey: 'invoice.status.toPay'},
  Paid: {icon: 'fa fa-check-circle', color: 'green', translationKey: 'invoice.status.paid'},
};

export const InvoiceStatusIcon = ({status, title, ...props}: InvoiceStatusIconProps) => {
  const config = statusConfig[status];
  return (
    <Icon
      className={`tst-invoice-status-${status.toLowerCase()}`}
      fa={config.icon}
      color={config.color}
      title={title || t(config.translationKey)}
      {...props}
    />
  );
};

type BusyInvoiceStatusIconProps = IconProps & {
  model: InvoiceModel;
}

const BaseStatusIcon = ({model, ...props}: BusyInvoiceStatusIconProps) => {
  const status = model?.status || 'Draft';
  const config = statusConfig[status];
  return (
    <Icon
      className={`tst-invoice-status-${status.toLowerCase()}`}
      fa={config.icon}
      color={config.color}
      {...props}
    />
  );
};

export const BusyInvoiceStatusIcon = connect((state: ConfacState) => ({isBusy: state.app.isBusy}))(EnhanceWithBusySpinner(BaseStatusIcon));
