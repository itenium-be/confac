import moment from "moment";
import Holidays from 'date-holidays';

class HolidaysService {
  /** Returns the number of workdays in the month */
  get(momentInst: moment.Moment): number {
    console.log('HolidaysService.get');

    const curMonth = momentInst.month();
    const hd = new Holidays('BE');

    const date = new Date(momentInst.year(), curMonth, 1);
    const result: Date[] = [];
    while (date.getMonth() === curMonth) {
      // date.getDay = index of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        if (!hd.isHoliday(date)) {
          result.push(date);
        }
      }
      date.setDate(date.getDate() + 1);
    }
    return result.length;
  }
}

export const holidaysService = new HolidaysService();
