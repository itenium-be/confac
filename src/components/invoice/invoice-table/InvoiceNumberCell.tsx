/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {Link} from 'react-router-dom';
import InvoiceModel from '../models/InvoiceModel';


type InvoiceNumberCellProps = {
  invoice: InvoiceModel,
}

export const InvoiceNumberCell = ({invoice}: InvoiceNumberCellProps) => {
  const link = invoice.isQuotation ? '/quotations' : '/invoices';
  return <Link to={`${link}/${invoice.number}`}>#{invoice.number}</Link>;
};
