import React from 'react';
import {t} from '../../util.js';

export const InvoiceWorkedDays = ({invoices, display = 'month'}) => {
  var days;
  if (typeof invoices.length !== 'number') {
    // one invoice object
    days = daysCalc(invoices);

  } else {
    // array of invoices
    const invoiceDays = invoices.map(daysCalc);
    days = invoiceDays.reduce((a, b) => ({
      worked: a.worked + b.worked,
      total: a.total + b.total,
      hours: a.hours + b.hours,
    }), {worked: 0, total: 0, hours: 0});
  }

  if (display === 'month') {
    return <span>{days.worked.toFixed(1)} / {days.total} ({calcPer(days)})</span>;
  }
  if (display === 'client') {
    return (
      <span>
        {t('client.hoursWorked', {hours: days.hours})}
        <br />
        {t('client.daysWorked', {days: days.worked.toFixed(1)})}
      </span>
    );
  }
};



function calcPer(daysWorked) {
  return Math.round(daysWorked.worked / daysWorked.total * 100) + '%';
}

function getWorkDaysInMonth(momentInst) {
  const curMonth = momentInst.month();

  var date = new Date(momentInst.year(), curMonth, 1);
  var result = [];
  while (date.getMonth() === curMonth) {
    // date.getDay = index of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      result.push(date);
    }
    date.setDate(date.getDate() + 1);
  }
  return result;
}

function daysCalc(invoice) {
  const daysWorked = invoice.money.totalValue / invoice.client.rate.hoursInDay;
  const workDays = getWorkDaysInMonth(invoice.date);
  const totalWorkDays = workDays.length;
  return {
    hours: invoice.money.totalValue,
    worked: daysWorked,
    total: totalWorkDays,
  };
}