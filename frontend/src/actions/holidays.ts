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




// Start work
const workerInstance = worker();
workerInstance.addEventListener('message', (message: any) => {
  if (!message.data?.count) {
    return;
  }

  const msg: WorkDaysMonth = message.data;
  holidaysService.cache[msg.month] = msg.count;
  // console.log('Cached holidays', message.data);
});

workerInstance.calcLastMonths(18);



export type WorkDaysMonth = {
  count: number;
  month: string;
}

type WorkDaysMonthCache = {[month: string]: number};
