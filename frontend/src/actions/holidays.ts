import moment from "moment";
import { isHoliday } from '@itenium/date-holidays-be';

type WorkDaysMonthCache = {[month: string]: number};

class HolidaysService {
  cache: WorkDaysMonthCache = {};

  /** Returns the number of workdays in the month */
  get(month: moment.Moment): number {
    const monthKey = month.format('YYYY-MM');
    if (!this.cache[monthKey])
      this.cache[monthKey] = getWorkDaysInMonth(month);

    return this.cache[monthKey]
  }
}

function getWorkDaysInMonth(momentInst: moment.Moment): number {
  const curMonth = momentInst.month();
  const date = new Date(momentInst.year(), curMonth, 1);
  const result: Date[] = [];
  while (date.getMonth() === curMonth) {
    // date.getDay = index of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (date.getDay() !== 0 && date.getDay() !== 6 && !isHoliday(date)) {
      result.push(date);
    }
    date.setDate(date.getDate() + 1);
  }

  return result.length;
}

export const holidaysService = new HolidaysService();
