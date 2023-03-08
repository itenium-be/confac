import moment from "moment";
import { getWorkDaysInMonth } from "../components/invoice/models/InvoiceModel";


// holidays.ts: workerInstance.calcLastMonths(18);
export function calcLastMonths(months) {
  postMessage('Starting holidays calculation');
  console.time(`last${months}Months`);

  Array(months)
    .fill('x')
    .map((_, i) => moment().subtract(i, 'months').startOf('month'))
    .forEach(month => {
      postMessage({
        count: getWorkDaysInMonth(month),
        month: month.format('YYYY-MM'),
      });
      console.log(`Calculated & Posted month ${month.format('YYYY-MM')}`);
    });

  console.timeEnd(`last${months}Months`);
}
