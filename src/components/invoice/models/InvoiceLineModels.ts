import {EditClientRateType, EditProjectRateType} from '../../../models';
import InvoiceModel from './InvoiceModel';
import {ProjectClientInvoiceLine} from '../../project/models/IProjectModel';


const DefaultTax = 21;
const DefaultRateType: EditProjectRateType = 'daily';


export type InvoiceLine = {
  desc: string,
  amount: number,
  type: EditClientRateType,
  price: number,
  tax: number,
  sort: number,
}


/** Switch location of two InvoiceLines */
function reorderLines(lines: InvoiceLine[], startIndex: number, endIndex: number): InvoiceLine[] {
  const newArr = lines.slice();
  const [removed] = newArr.splice(startIndex, 1);
  newArr.splice(endIndex, 0, removed);
  return newArr;
}



function addEmptyLine(lines: InvoiceLine[]): InvoiceLine[] {
  return (lines || []).concat([getNewInvoiceLine(lines)]);
}



export function getNewInvoiceLine(lines?: Array<InvoiceLine | ProjectClientInvoiceLine>): ProjectClientInvoiceLine {
  const defaultLine: ProjectClientInvoiceLine = {
    desc: '',
    price: 0,
    amount: 0,
    tax: DefaultTax,
    type: DefaultRateType,
    sort: lines ? lines.reduce((acc, line) => (acc <= line.sort ? line.sort + 1 : acc), 0) : 0,
  };

  return defaultLine;
}



function updateLine(lines: InvoiceLine[], index: number, updateWith: Partial<InvoiceLine>, invoice?: InvoiceModel): InvoiceLine[] {
  const newArr = lines.slice();

  daysVsHoursSwitchFix(newArr[index], updateWith, invoice);

  newArr[index] = {...newArr[index], ...updateWith};
  return newArr;
}



function daysVsHoursSwitchFix(input: InvoiceLine, updateWith: Partial<InvoiceLine>, invoice?: InvoiceModel): void {
  const oldLine = input;

  if (updateWith.type && updateWith.type !== oldLine.type && (oldLine.price || oldLine.amount)
    && invoice && invoice.client && invoice.client.hoursInDay) {

    const newType = updateWith.type;
    const oldType = oldLine.type;


    if (oldType === 'daily' && newType === 'hourly') {
      if (oldLine.price) {
        oldLine.price /= invoice.client.hoursInDay;
      }
      if (oldLine.amount) {
        oldLine.amount *= invoice.client.hoursInDay;
      }

    } else if (oldType === 'hourly' && newType === 'daily') {
      if (oldLine.price) {
        oldLine.price *= invoice.client.hoursInDay;
      }
      if (oldLine.amount) {
        oldLine.amount /= invoice.client.hoursInDay;
      }
    }
  }
}



function removeLine(lines: InvoiceLine[], index: number): InvoiceLine[] {
  const newArr = lines.slice();
  newArr.splice(index, 1);
  return newArr;
}


export const InvoiceLineActions = {
  reorderLines,
  addEmptyLine,
  updateLine,
  removeLine,
};
