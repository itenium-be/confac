import moment from "moment";
import { getWorkDaysInMonth } from "../components/invoice/models/InvoiceModel";


// PERF: File 3: The function name matches the one in holidays.ts
// holidays.ts: workerInstance.calcLastMonths(18);
export function calcLastMonths(months) {
  postMessage('Starting holidays calculation');
  console.time(`last${months}Months`);

  Array(months)
    .fill('x')
    .map((_, i) => moment().subtract(i, 'months').startOf('month'))
    // PERF: We post a message for every calculation finished
    .forEach(month => {
      postMessage({
        count: getWorkDaysInMonth(month),
        month: month.format('YYYY-MM'),
      });
      console.log(`Calculated & Posted month ${month.format('YYYY-MM')}`);
    });

  console.timeEnd(`last${months}Months`);
}
