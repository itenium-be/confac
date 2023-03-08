import moment from "moment";
import { getWorkDaysInMonth } from "../components/invoice/models/InvoiceModel";


export function calcLastMonths(months) {
  const curMonth = getWorkDaysInMonth(moment());
  postMessage({workDays: [curMonth]});

  // PERF: Built-in console: time & timeEnd
  console.time(`last${months}Months`);

  const result = Array(months)
    .fill('x')
    .map((_, i) => moment().subtract(i, 'months').startOf('month'))
    .reduce((acc, month, i) => {
      const workDays = {
        count: getWorkDaysInMonth(month),
        month: month.format('YYYY-MM'),
      };

      // PERF: The first projectMonth is opened by default so we post that one directly
      if (i === 0) {
        postMessage({workDays: [workDays]});
        return acc;
      }

      return acc.concat([workDays]);
    }, []);

  // PERF: By the time the user has clicked anything everything should be loaded (+/- 1s)
  postMessage({workDays: result});

  // PERF: console.timeEnd here
  console.timeEnd(`last${months}Months`);
}
