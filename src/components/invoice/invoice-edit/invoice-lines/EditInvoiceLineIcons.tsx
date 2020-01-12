import React from 'react';
import InvoiceModel, {InvoiceLine} from '../../models/InvoiceModel';
import {DeleteIcon, DragAndDropIcon} from '../../../controls/Icon';


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

  return <DeleteIcon onClick={() => onChange(invoice.removeLine(index))} data-tst={`line-${index}-delete`} />;
};


export const EditInvoiceDragHandle = () => <td><DragAndDropIcon /></td>;
