/* eslint-disable react/jsx-one-expression-per-line */
import React, {useState} from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {createInvoice, patchProjectsMonth, deleteProjectMonthAttachmentDetails} from '../../../actions';
import {Button} from '../../controls/form-controls/Button';
import {Icon, NotEmailedIcon, EmailedIcon} from '../../controls/Icon';
import {t, moneyFormat, formatDate} from '../../utils';
import {ConfacState} from '../../../reducers/app-state';
import {getNewInvoice, NewInvoiceType} from '../../invoice/models/getNewInvoice';
import {InvoiceNumberCell} from '../../invoice/invoice-table/InvoiceNumberCell';
import {InvoiceListRowActions} from '../../invoice/invoice-table/InvoiceListRowActions';
import {ValidityToggleButton} from '../../controls/form-controls/button/ValidityToggleButton';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {useDebouncedSave} from '../../hooks/useDebounce';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {EmailModal, EmailTemplate} from '../../controls/email/EmailModal';
import {InvoiceLine} from '../../invoice/models/InvoiceLineModels';
import {Claim} from '../../users/models/UserModel';
import {ClaimGuard} from '../../enhancers/EnhanceWithClaim';


interface ProjectMonthOutboundCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** Outbound form cell for a ProjectMonth row */
export const ProjectMonthOutboundCell = ({fullProjectMonth}: ProjectMonthOutboundCellProps) => {
  const dispatch = useDispatch();

  const dispatcher = (orderNr: string) => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, orderNr}) as any);
  };
  const [orderNr, setOrderNr/* , saveOrderNr */] = useDebouncedSave<string>(fullProjectMonth.details.orderNr || '', dispatcher);


  const toggleValid = (verified: boolean | 'forced') => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, verified}) as any);
  };



  const ValidityToggle = (
    <ValidityToggleButton
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



  return (
    <OutboundInvoice fullProjectMonth={fullProjectMonth} toggleValid={toggleValid} />
  );
};


interface OutboundInvoiceProps {
  fullProjectMonth: FullProjectMonthModel;
  toggleValid: (valid: boolean) => void;
}


const OutboundInvoice = ({fullProjectMonth, toggleValid}: OutboundInvoiceProps) => {
  if (!fullProjectMonth.invoice) {
    return null;
  }

  return (
    <div className="outbound-invoice-cell">
      <div>
        <span style={{whiteSpace: 'nowrap'}}>{moneyFormat(fullProjectMonth.invoice.money.total)}</span>
        <span>
          <InvoiceNumberCell invoice={fullProjectMonth.invoice} />
          &nbsp;({formatDate(fullProjectMonth.invoice.date, 'D/M')})
        </span>
      </div>
      <div className="email">
        <InvoiceEmail invoice={fullProjectMonth.invoice} />
      </div>
      <div className="icons-cell">
        <InvoiceListRowActions invoice={fullProjectMonth.invoice} toggleValid={toggleValid} small />
      </div>
    </div>
  );
};

type InvoiceEmailProps = {
  invoice: InvoiceModel;
}

export const InvoiceEmail = ({invoice}: InvoiceEmailProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <ClaimGuard claim={Claim.EmailInvoices}>
      <Button onClick={() => setShowModal(true)} variant="link">
        {!invoice.lastEmail ? (
          <NotEmailedIcon style={{fontSize: 17}} />
        ) : (
          <EmailedIcon title={t('email.lastEmailDaysAgo', {daysAgo: moment(invoice.lastEmail).fromNow()})} style={{fontSize: 17}} />
        )}
      </Button>
      {showModal && (
        <EmailModal
          template={invoice.lastEmail ? EmailTemplate.Reminder : EmailTemplate.InitialEmail}
          invoice={invoice}
          onClose={() => setShowModal(false)}
        />
      )}
    </ClaimGuard>
  );
};


function getInvoiceDesc(lineDesc: string, lineIndex: number, defaultInvoiceLines: InvoiceLine[]): string {
  if (lineDesc) {
    return lineDesc;
  }

  if (defaultInvoiceLines[lineIndex]) {
    return defaultInvoiceLines[lineIndex].desc;
  }

  if (defaultInvoiceLines.length) {
    return defaultInvoiceLines[0].desc;
  }

  return '';
}


interface CreateInvoiceButtonProps {
  fullProjectMonth: FullProjectMonthModel;
}

const CreateInvoiceButton = ({fullProjectMonth}: CreateInvoiceButtonProps) => {
  const dispatch = useDispatch();
  const state = useSelector((s: ConfacState) => s);

  const buildInvoice = () => {
    const invoiceLines = fullProjectMonth.project.client.defaultInvoiceLines.map((invoiceLine, index) => ({
      ...invoiceLine,
      amount: fullProjectMonth.details.timesheet.timesheet || 0,
      desc: getInvoiceDesc(invoiceLine.desc, index, state.config.defaultInvoiceLines),
    }));

    const blueprint: NewInvoiceType = {
      isQuotation: false,
      client: fullProjectMonth.client,
      orderNr: fullProjectMonth.details.orderNr || fullProjectMonth.project.client.ref,
      projectMonth: {
        projectMonthId: fullProjectMonth._id,
        month: fullProjectMonth.details.month,
        consultantId: fullProjectMonth.consultant._id,
        consultantName: `${fullProjectMonth.consultant.firstName} ${fullProjectMonth.consultant.name}`,
      },
      lines: invoiceLines,
      note: fullProjectMonth.details.note,
    };

    return getNewInvoice(state.config, state.invoices, state.clients, blueprint);
  };


  const createInvoiceFully = (inv: InvoiceModel) => {
    dispatch(createInvoice(inv) as any);
    dispatch(deleteProjectMonthAttachmentDetails(fullProjectMonth.details) as any);
  };


  const valid = (
    fullProjectMonth.details.timesheet.validated
    && (!fullProjectMonth.project.projectMonthConfig.changingOrderNr || fullProjectMonth.details.orderNr)
    // && (
    //   ['paid', 'validated'].includes(fullProjectMonth.details.inbound.status)
    //   || !fullProjectMonth.project.projectMonthConfig.inboundInvoice
    // )
  );

  const invoice = buildInvoice();
  const money = {
    totalWithoutTax: moneyFormat(invoice.money.totalWithoutTax),
    total: moneyFormat(invoice.money.total),
  };
  const title = invoice.money.total ? t('projectMonth.outboundCreateInvoiceTitle', money) : undefined;

  return (
    <ClaimGuard claim={Claim.ManageInvoices}>
      <Button variant={valid ? 'success' : 'outline-danger'} onClick={() => createInvoiceFully(invoice)} title={title}>
        <Icon fa="fa fa-file-invoice" size={1} style={{marginRight: 8}} />
        {t('projectMonth.outboundCreateInvoice')}
      </Button>
    </ClaimGuard>
  );
};
