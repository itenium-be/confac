import React from 'react';
import {DeleteIcon} from '../../../controls/icons/DeleteIcon';
import {InvoiceLine, InvoiceLineActions} from '../../models/InvoiceLineModels';


type EditInvoiceLineIconsProps = {
  lines: InvoiceLine[],
  index: number;
  allowEmpty?: boolean,
  onChange: (lines: InvoiceLine[]) => void,
}


export const EditInvoiceLineIcons = ({index, onChange, lines, allowEmpty}: EditInvoiceLineIconsProps) => {
  if (index === 0 && !allowEmpty) {
    return <td>&nbsp;</td>;
  }

  return <td><DeleteIcon onClick={() => onChange(InvoiceLineActions.removeLine(lines, index))} /></td>;
};
