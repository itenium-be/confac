import moment from "moment";

// create-react-app doesn't support web workers out of the box (would need to eject)
import worker from 'workerize-loader!./holidaysLoader'; // eslint-disable-line import/no-webpack-loader-syntax



class HolidaysService {
  cache: WorkDaysMonthCache = {};

  /** Returns the number of workdays in the month */
  get(month: moment.Moment): number {
    return this.cache[month.format('YYYY-MM')];
  }
}

export const holidaysService = new HolidaysService();



// PERF: File 2: Web Worker to delegate this "expensive" work

// Start work
const workerInstance = worker();
workerInstance.addEventListener('message', (message: any) => {
  if (!message.data?.count) {
    return;
  }

  // PERF: Listening to postMessage from our WebWorker to populate the local cache
  const msg: WorkDaysMonth = message.data;
  holidaysService.cache[msg.month] = msg.count;
  // console.log('Cached holidays', message.data);
});

// PERF: Start calculating the holidays for the last 18 months
workerInstance.calcLastMonths(18);



export type WorkDaysMonth = {
  count: number;
  month: string;
}

type WorkDaysMonthCache = {[month: string]: number};
