import { useSelector } from 'react-redux';
import { FullProjectMonthModel } from '../../models/FullProjectMonthModel';
import { moneyFormat } from '../../../utils';
import { ConfacState } from '../../../../reducers/app-state';
import { getTariffs } from '../../utils/getTariffs';
import { ToClipboardLabel } from '../../../controls/other/ToClipboardLabel';


type ProformaForecastProps = {
  fullProjectMonth: FullProjectMonthModel;
};


/** Expected inbound total invoice amount */
export const ProformaForecast = ({ fullProjectMonth }: ProformaForecastProps) => {
  const tax = useSelector((state: ConfacState) => state.config.defaultInvoiceLines[0].tax);
  const { timesheet } = fullProjectMonth.details;
  if (!timesheet.timesheet) {
    return <div />;
  }

  let amount = timesheet.timesheet;
  const proforma = fullProjectMonth.project.projectMonthConfig.proforma;
  if (proforma === 'inboundWithTax' || proforma === 'inboundWithoutTax') {
    if (!fullProjectMonth.project.partner) {
      return <div />;
    }

    const tariff = getTariffs(fullProjectMonth.project.partner);
    amount *= tariff.tariff;
    if (tariff.rateType === 'hourly') {
      amount /= fullProjectMonth.client.hoursInDay;
    }
    if (proforma === 'inboundWithTax') {
      amount *= (1 + tax / 100);
    }
  }

  if (proforma === 'outboundWithTax' || proforma === 'outboundWithoutTax') {
    const tariff = getTariffs(fullProjectMonth.project.client);
    amount *= tariff.tariff;
    if (tariff.rateType === 'hourly') {
      amount /= fullProjectMonth.client.hoursInDay;
    }
    if (proforma === 'outboundWithTax') {
      amount *= (1 + tax / 100);
    }
  }

  return (
    <ToClipboardLabel label={moneyFormat(amount)} copyValue={amount.toFixed(2)} />
  );
};
