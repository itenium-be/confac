/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {createInvoice, patchProjectsMonth, deleteProjectMonthAttachmentDetails} from '../../../actions';
import {Button} from '../../controls/form-controls/Button';
import {Icon} from '../../controls/Icon';
import {t, moneyFormat, formatDate} from '../../utils';
import {ConfacState} from '../../../reducers/app-state';
import {getNewInvoice} from '../../invoice/models/getNewInvoice';
import {InvoiceNumberCell} from '../../invoice/invoice-table/InvoiceNumberCell';
import {InvoiceListRowActions} from '../../invoice/invoice-table/InvoiceListRowActions';
import {ValidityToggleButton} from '../../controls/form-controls/button/ValidityToggleButton';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {useDebouncedSave} from '../../hooks/useDebounce';


interface ProjectMonthOutboundCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** Outbound form cell for a ProjectMonth row */
export const ProjectMonthOutboundCell = ({fullProjectMonth}: ProjectMonthOutboundCellProps) => {
  const dispatch = useDispatch();

  const dispatcher = (orderNr: string) => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, orderNr}));
  };
  const [orderNr, setOrderNr/* , saveOrderNr */] = useDebouncedSave<string>(fullProjectMonth.details.orderNr || '', dispatcher);


  const toggleValid = (verified: boolean) => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, verified: verified ? 'forced' : false}));
  };



  const ValidityToggle = (
    <ValidityToggleButton
      value={!!fullProjectMonth.details.verified}
      onChange={() => toggleValid(!fullProjectMonth.details.verified)}
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



  return (
    <OutboundInvoice fullProjectMonth={fullProjectMonth} />
  );
};


interface CreateInvoiceButtonProps {
  fullProjectMonth: FullProjectMonthModel;
}


const OutboundInvoice = ({fullProjectMonth}: CreateInvoiceButtonProps) => {
  if (!fullProjectMonth.invoice) {
    return null;
  }

  return (
    <div className="outbound-invoice-cell">
      <div>
        <span>{moneyFormat(fullProjectMonth.invoice.money.total)}</span>
        <span>
          <InvoiceNumberCell invoice={fullProjectMonth.invoice} />
          &nbsp;({formatDate(fullProjectMonth.invoice.date, 'D/M')})
        </span>
      </div>
      <div className="icons-cell">
        <InvoiceListRowActions invoice={fullProjectMonth.invoice} />
      </div>
    </div>
  );
};



const CreateInvoiceButton = ({fullProjectMonth}: CreateInvoiceButtonProps) => {
  const dispatch = useDispatch();
  const state = useSelector((s: ConfacState) => s);

  const buildAndCreateInvoice = () => {
    const blueprint = {
      isQuotation: false,
      client: fullProjectMonth.client,
      orderNr: fullProjectMonth.details.orderNr || fullProjectMonth.project.client.ref,
      projectMonthId: fullProjectMonth._id,
      consultantId: fullProjectMonth.consultant._id,
      lines: [{
        sort: 0,
        desc: '',
        amount: fullProjectMonth.details.timesheet.timesheet || 0,
        type: fullProjectMonth.project.client.rateType,
        price: fullProjectMonth.project.client.tariff,
        tax: state.config.defaultTax,
      }],
    };

    const invoice = getNewInvoice(state.config, state.invoices, state.clients, blueprint);
    dispatch(createInvoice(invoice));
    dispatch(deleteProjectMonthAttachmentDetails(fullProjectMonth.details));
  };



  const valid = (
    fullProjectMonth.details.timesheet.validated
    && (!fullProjectMonth.project.projectMonthConfig.changingOrderNr || fullProjectMonth.details.orderNr)
    && (fullProjectMonth.details.inbound.status === 'paid' || !fullProjectMonth.project.projectMonthConfig.inboundInvoice)
  );

  return (
    <>
      <Button key="new" variant={valid ? 'success' : 'outline-danger'} onClick={() => buildAndCreateInvoice()} size="md">
        <Icon fa="fa fa-file-invoice" size={1} style={{marginRight: 8}} />
        {t('projectMonth.outboundCreateInvoice')}
      </Button>
    </>
  );
};
