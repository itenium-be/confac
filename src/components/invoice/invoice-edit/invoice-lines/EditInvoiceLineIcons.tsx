import React from 'react';
import * as Control from '../../../controls';
import InvoiceModel, {InvoiceLine} from '../../models/InvoiceModel';


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

  return <Control.DeleteIcon onClick={() => onChange(invoice.removeLine(index))} data-tst={`line-${index}-delete`} />;
};


export const EditInvoiceDragHandle = () => <td><Control.DragAndDropIcon /></td>;
