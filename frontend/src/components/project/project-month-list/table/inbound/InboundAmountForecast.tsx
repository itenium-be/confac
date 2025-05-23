import {useSelector} from 'react-redux';
import {FullProjectMonthModel} from '../../../models/FullProjectMonthModel';
import {moneyFormat} from '../../../../utils';
import {ConfacState} from '../../../../../reducers/app-state';
import {addPartnerRate} from '../../../utils/getTariffs';
import {ToClipboardLabel} from '../../../../controls/other/ToClipboardLabel';


type InboundAmountForecastProps = {
  fullProjectMonth: FullProjectMonthModel;
};


/** Expected inbound total invoice amount */
export const InboundAmountForecast = ({fullProjectMonth}: InboundAmountForecastProps) => {
  const tax = useSelector((state: ConfacState) => state.config.defaultInvoiceLines[0].tax);
  const {timesheet} = fullProjectMonth.details;
  if (!timesheet.timesheet || !fullProjectMonth.project.partner) {
    return <div />;
  }

  let amount = addPartnerRate(timesheet.timesheet, fullProjectMonth);
  const addTax = !fullProjectMonth.partner?.country?.trim() || fullProjectMonth.partner.country === 'BE';
  if (addTax) {
    amount *= (1 + tax / 100);
  }

  return (
    <ToClipboardLabel label={moneyFormat(amount)} copyValue={amount.toFixed(2)} />
  );
};
