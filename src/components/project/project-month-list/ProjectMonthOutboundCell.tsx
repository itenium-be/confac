/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FullProjectMonthModel, ProjectMonthOutbound} from '../models/ProjectMonthModel';
import {patchProjectsMonth, createInvoice} from '../../../actions';
import {getNewProjectMonthOutbound} from '../models/getNewProject';
import {useDebouncedSave} from '../../hooks/useDebounce';
import {Button} from '../../controls/form-controls/Button';
import {Icon} from '../../controls/Icon';
import {t, moneyFormat, formatDate} from '../../utils';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import {ConfacState} from '../../../reducers/app-state';
import {getNewInvoice} from '../../invoice/models/getNewInvoice';
import {InvoiceNumberCell} from '../../invoice/invoice-table/InvoiceNumberCell';
import {InvoiceListRowActions} from '../../invoice/invoice-table/InvoiceListRowActions';


interface ProjectMonthOutboundCellProps {
  projectMonth: FullProjectMonthModel;
}


/** Outbound form cell for a ProjectMonth row */
export const ProjectMonthOutboundCell = ({projectMonth}: ProjectMonthOutboundCellProps) => {
  const dispatch = useDispatch();

  const defaultOutbound = projectMonth.details.outbound || getNewProjectMonthOutbound();
  const dispatcher = (val: ProjectMonthOutbound) => {
    dispatch(patchProjectsMonth({...projectMonth.details, outbound: val}));
  };
  const [outbound, setOutbound, saveOutbound] = useDebouncedSave<ProjectMonthOutbound>(defaultOutbound, dispatcher);

  // TODO: NotesModalButton is no longer visible when there is an invoice!
  // TODO: Even without having an invoice created it should be possible to mark it 'invoice.verified'.
  // TODO: add "email invoice" functionality with statusses: Not emailed / Emailed: Tooltip with when last emailed (date + how many days ago)
  // TODO: "Factuur maken" | "Factuur linken": Link dit naar een bestaande factuur (Need invoice selector) --> Update dan de invoice.projectId & invoice.consultantId
  // TODO: When creating the invoice, the attachments are not reassigned (from projectMonth -> invoice)


  if (!projectMonth.invoice) {
    return (
      <div className="outbound-cell">
        <CreateInvoiceButton projectMonth={projectMonth} />


        <NotesModalButton
          value={outbound.note}
          onChange={val => saveOutbound({...outbound, note: val})}
          title={t('projectMonth.outboundNote')}
        />
      </div>
    );
  }

  return (
    <OutboundInvoice projectMonth={projectMonth} />
  );
};


const OutboundInvoice = ({projectMonth}: CreateInvoiceButtonProps) => {
  if (!projectMonth.invoice) {
    return null;
  }

  // console.log('zed', projectMonth.invoice);
  return (
    <div className="outbound-invoice-cell">
      <div>
        <span>{moneyFormat(projectMonth.invoice.money.total)}</span>
        <span>
          <InvoiceNumberCell invoice={projectMonth.invoice} />
          &nbsp;({formatDate(projectMonth.invoice.date, 'D/M')})
        </span>
      </div>
      <div className="icons-cell">
        <InvoiceListRowActions invoice={projectMonth.invoice} />
      </div>
    </div>
  );
};





interface CreateInvoiceButtonProps {
  projectMonth: FullProjectMonthModel;
}


const CreateInvoiceButton = ({projectMonth}: CreateInvoiceButtonProps) => {
  const dispatch = useDispatch();
  const state = useSelector((s: ConfacState) => s);

  const buildAndCreateInvoice = () => {
    const blueprint = {
      isQuotation: false,
      client: projectMonth.client,
      orderNr: projectMonth.project.client.ref,
      projectId: projectMonth._id,
      consultantId: projectMonth.consultant._id,
      lines: [{
        sort: 0,
        desc: '',
        amount: projectMonth.details.timesheet.timesheet || 0,
        type: projectMonth.project.client.rateType,
        price: projectMonth.project.client.tariff,
        tax: state.config.defaultTax,
      }],
    };

    const invoice = getNewInvoice(state.config, state.invoices, state.clients, blueprint);
    // console.log('creating', invoice);
    dispatch(createInvoice(invoice));
  };



  const valid = (
    projectMonth.details.timesheet.validated
    && (projectMonth.details.inbound.status === 'paid' || !projectMonth.project.projectMonthConfig.inboundInvoice)
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
