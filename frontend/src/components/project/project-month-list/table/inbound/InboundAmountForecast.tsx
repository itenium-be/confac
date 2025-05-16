import { useSelector } from 'react-redux';
import { FullProjectMonthModel } from '../../../models/FullProjectMonthModel';
import { moneyFormat } from '../../../../utils';
import { ConfacState } from '../../../../../reducers/app-state';
import { getTariffs } from '../../../utils/getTariffs';
import { ToClipboardLabel } from '../../../../controls/other/ToClipboardLabel';


type InboundAmountForecastProps = {
  fullProjectMonth: FullProjectMonthModel;
};


/** Expected inbound total invoice amount */
export const InboundAmountForecast = ({ fullProjectMonth }: InboundAmountForecastProps) => {
  const tax = useSelector((state: ConfacState) => state.config.defaultInvoiceLines[0].tax);
  const { timesheet } = fullProjectMonth.details;
  if (!timesheet.timesheet || !fullProjectMonth.project.partner) {
    return <div />;
  }

  const timesheetConfig = {
    amount: timesheet.timesheet,
    hoursInDay: fullProjectMonth.client.hoursInDay,
  };

  const clientTariffs = getTariffs(fullProjectMonth.project.client);
  const partnerTariffs = getTariffs(fullProjectMonth.project.partner);
  if (clientTariffs.rateType !== partnerTariffs.rateType) {
    switch (clientTariffs.rateType) {
      case 'hourly':
        timesheetConfig.amount /= timesheetConfig.hoursInDay;
        break;

      case 'daily':
      default:
        timesheetConfig.amount *= timesheetConfig.hoursInDay;
    }
  }


  let amount = timesheetConfig.amount;
  if (!fullProjectMonth.partner || !fullProjectMonth.partner.country?.trim() || fullProjectMonth.partner.country === 'BE') {
    amount *= (1 + tax / 100);
  }

  const totalAmount = amount * partnerTariffs.tariff;
  return (
    <ToClipboardLabel label={moneyFormat(totalAmount)} copyValue={totalAmount.toFixed(2)} />
  );
};
