import {DeleteIcon} from '../../../controls/icons/DeleteIcon';
import {InvoiceLine, InvoiceLineActions} from '../../models/InvoiceLineModels';
import {Claim} from '../../../users/models/UserModel';


type EditInvoiceLineIconsProps = {
  lines: InvoiceLine[],
  index: number;
  /** Allow 0 invoice lines? */
  allowEmpty?: boolean,
  onChange: (lines: InvoiceLine[]) => void,
  claim?: Claim;
}


export const EditInvoiceLineIcons = ({claim, index, onChange, lines, allowEmpty}: EditInvoiceLineIconsProps) => {
  if (index === 0 && !allowEmpty) {
    return <td>&nbsp;</td>;
  }

  return <td><DeleteIcon claim={claim} onClick={() => onChange(InvoiceLineActions.removeLine(lines, index))} /></td>;
};
