import React, {Component} from 'react';
import * as Control from '../../controls';
import EditInvoiceModel, { EditInvoiceLine } from '../EditInvoiceModel';


type EditInvoiceLineIconsProps = {
  index: number,
  onChange: any,
  invoice: EditInvoiceModel,
  line: EditInvoiceLine,
}

export class EditInvoiceLineIcons extends Component<EditInvoiceLineIconsProps> {
  render() {
    return (
      <td>
        <EditInvoiceDeleteLineIcon {...this.props} />
      </td>
    );
  }
}


class EditInvoiceDeleteLineIcon extends Component<EditInvoiceLineIconsProps> {
  render() {
    const {index, onChange, invoice} = this.props;
    if (!index) {
      return null;
    }

    return <Control.DeleteIcon onClick={() => onChange(invoice.removeLine(index))} data-tst={`line-${index}-delete`} />;
  }
}


export const EditInvoiceDragHandle = () => <td><Control.DragAndDropIcon /></td>;
