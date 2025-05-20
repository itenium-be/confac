import {useDispatch} from 'react-redux';
import {FullProjectMonthModel} from '../../../models/FullProjectMonthModel';
import {patchProjectsMonth} from '../../../../../actions';
import {t} from '../../../../utils';
import {ValidityToggleButton} from '../../../../controls/form-controls/button/ValidityToggleButton';
import {StringInput} from '../../../../controls/form-controls/inputs/StringInput';
import {useDebouncedSave} from '../../../../hooks/useDebounce';
import { CreateInvoiceButton } from './CreateInvoiceButton';
import { OutboundInvoice } from './OutboundInvoice';
import { Claim } from '../../../../users/models/UserModel';
import { useSelector } from 'react-redux';
import { ConfacState } from '../../../../../reducers/app-state';
import { getInvoiceDueDateStyle } from '../../../../invoice/invoice-table/getInvoiceListRowClass';


interface ProjectMonthOutboundCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** Outbound form cell for a ProjectMonth row */
export const ProjectMonthOutboundCell = ({fullProjectMonth}: ProjectMonthOutboundCellProps) => {
  const dispatch = useDispatch();
  const invoices = useSelector((state: ConfacState) => state.invoices);

  const dispatcher = (orderNr: string) => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, orderNr}) as any);
  };
  const [orderNr, setOrderNr/* , saveOrderNr */] = useDebouncedSave<string>(fullProjectMonth.details.orderNr || '', dispatcher);


  const toggleValid = (verified: boolean | 'forced') => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, verified}) as any);
  };

  const ValidityToggle = (
    <ValidityToggleButton
      claim={Claim.ValidateProjectMonth}
      value={!!fullProjectMonth.details.verified}
      onChange={() => toggleValid(fullProjectMonth.details.verified ? false : 'forced')}
      outline
      title={t('projectMonth.forceVerified')}
    />
  );



  if (fullProjectMonth.details.verified === 'forced') {
    return (
      <div className="outbound-cell validated">
        <div />
        {ValidityToggle}
      </div>
    );
  }




  if (!fullProjectMonth.invoice && fullProjectMonth.project.projectMonthConfig.changingOrderNr) {
    return (
      <div className="outbound-cell">
        <div className="split-orderNr">
          <StringInput
            value={orderNr}
            onChange={nr => setOrderNr(nr)}
            placeholder={t('invoice.orderNrShort')}
          />
          <CreateInvoiceButton fullProjectMonth={fullProjectMonth} />
        </div>
        {ValidityToggle}
      </div>
    );
  }


  if (!fullProjectMonth.invoice) {
    return (
      <div className="outbound-cell">
        <CreateInvoiceButton fullProjectMonth={fullProjectMonth} />
        {ValidityToggle}
      </div>
    );
  }


  const invoiceList = [
    ...(fullProjectMonth.invoice.creditNotas || []),
    fullProjectMonth.invoice._id
  ];

  return (
    <>
      {invoiceList
        .sort((a, b) => a.localeCompare(b))
        .map(nbr => invoices.find(i => i._id === nbr))
        .filter(i => i !== undefined)
        .map(i => (
          <OutboundInvoice
            key={i!.number}
            invoice={i!}
            style={getInvoiceDueDateStyle(i!)}
          />
        ))}
    </>
  );
};
