import moment from "moment";
import { getWorkDaysInMonth } from "../components/invoice/models/InvoiceModel";


export function calcLastMonths(months) {
  postMessage('Starting holidays calculation');
  console.time(`last${months}Months`);

  const result = Array(months)
    .fill('x')
    .map((_, i) => moment().subtract(i, 'months').startOf('month'))
    .reduce((acc, month, i) => {
      const workDays = {
        count: getWorkDaysInMonth(month),
        month: month.format('YYYY-MM'),
      };

      if (i === 0 || i === 1) {
        postMessage({workDays: [workDays]});
        return acc;
      }
      return acc.concat([workDays]);

    }, []);

  postMessage({workDays: result});
  console.timeEnd(`last${months}Months`);
}
