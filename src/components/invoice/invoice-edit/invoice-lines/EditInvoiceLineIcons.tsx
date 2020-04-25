import React from 'react';
import InvoiceModel, {InvoiceLine} from '../../models/InvoiceModel';
import {DragAndDropIcon} from '../../../controls/Icon';
import {DeleteIcon} from '../../../controls/icons/DeleteIcon';


type EditInvoiceLineIconsProps = {
  index: number,
  onChange: any,
  invoice: InvoiceModel,
  line: InvoiceLine,
}

export const EditInvoiceLineIcons = (props: EditInvoiceLineIconsProps) => (
  <td>
    <EditInvoiceDeleteLineIcon {...props} />
  </td>
);


const EditInvoiceDeleteLineIcon = (props: EditInvoiceLineIconsProps) => {
  const {index, onChange, invoice} = props;
  if (!index) {
    return null;
  }

  return <DeleteIcon onClick={() => onChange(invoice.removeLine(index))} />;
};


export const EditInvoiceDragHandle = () => <td><DragAndDropIcon /></td>;
