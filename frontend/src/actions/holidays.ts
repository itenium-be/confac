import moment from "moment";
// import { isHoliday } from "@itenium/date-holidays-be";

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




function getEaster(year: number) {
  const C = Math.floor(year / 100);
  const N = year - 19 * Math.floor(year / 19);
  const K = Math.floor((C - 17) / 25);
  let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I = I - 30 * Math.floor((I / 30));
  I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
  let J = year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4);
  J = J - 7 * Math.floor(J / 7);
  const L = I - J;
  const M = 3 + Math.floor((L + 40) / 44);
  const D = L + 28 - 31 * Math.floor(M / 4);

  return new Date(year, M - 1, D);
}

function getEasterMonday(year: number) {
  const easter = getEaster(year);
  const daysToMonday = ((7 - easter.getDay()) % 7 + 1) % 7;
  return new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + daysToMonday);
}

function getAscensionDay(year: number) {
  let date = new Date(getEaster(year));
  date.setDate(date.getDate() + 39);
  return date;
}

function getWhitMonday(year: number) {
  let whitMonday = new Date(getAscensionDay(year));
  whitMonday.setDate(whitMonday.getDate() + 9);
  const daysToMonday = ((7 - whitMonday.getDay()) % 7 + 1) % 7;
  whitMonday.setDate(whitMonday.getDate() + daysToMonday);
  return whitMonday;
}


/** Get all official Belgian holidays in the provided year */
export function getHolidays(year: number): Holiday[] {
  return [
      {date: new Date(year, 0, 1), labels: {nl: 'Nieuwjaar', fr: 'Nouvel An', de: 'Neujahr', en: 'New Year\'s Day'}},
      {date: getEasterMonday(year), labels: {nl:'Tweede paasdag', fr: 'Lundi de Pâques', de: 'Ostermontag', en: 'Easter Monday'}},
      {date: new Date(year, 4, 1), labels: {nl:'Dag van de Arbeid', fr: 'Fête du travail', de: 'Tag der Arbeit', en: 'Labour day'}},
      {date: getAscensionDay(year), labels: {nl:'O.L.H. Hemelvaart', fr: 'Ascension', de: 'Christi Himmelfahrt', en: 'Ascension Day'}},
      {date: getWhitMonday(year), labels: {nl:'Tweede pinksterdag', fr: 'Lundi de Pentecôte', de: 'Pfingstmontag', en: 'Whit Monday'}},
      {date: new Date(year, 6, 21), labels: {nl: 'Nationale feestdag', fr: 'Fête nationale', de: 'Nationalfeiertag', en: 'National Holiday'}},
      {date: new Date(year, 7, 15), labels: {nl:'O.L.V. Hemelvaart', fr: 'Assomption', de: 'Mariä Himmelfahrt', en: 'Assumption'}},
      {date: new Date(year, 10, 1), labels: {nl:'Allerheiligen', fr: 'Toussaint', de: 'Allerheiligen', en: 'All Saints\' Day'}},
      {date: new Date(year, 10, 11), labels: {nl:'Wapenstilstand', fr:  'Armistice', de: 'Waffenstillstand', en: 'Armistice'}},
      {date: new Date(year, 11, 25), labels: {nl:'Kerstmis', fr: 'Noël', de: 'Weihnachten', en: 'Christmas Day'}}
  ];
}


/** Returns whether the provided Date is an official Belgian holiday */
export function isHoliday(date: Date): boolean {
  if (!date) {
      return false;
  }

  return getHolidays(date.getFullYear()).some(item => {
      return item.date.getDate() === date.getDate() &&
          item.date.getMonth() === date.getMonth() &&
          item.date.getFullYear() === date.getFullYear();
  });
}

export type Holiday = {
  date: Date;
  labels: {
      nl: string;
      fr: string;
      de: string;
      en: string;
  }
}
