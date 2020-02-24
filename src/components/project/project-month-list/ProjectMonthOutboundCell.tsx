/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FullProjectMonthModel, ProjectMonthModel} from '../models/ProjectMonthModel';
import {createInvoice, patchProjectsMonth} from '../../../actions';
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
  projectMonth: FullProjectMonthModel;
}


/** Outbound form cell for a ProjectMonth row */
export const ProjectMonthOutboundCell = ({projectMonth}: ProjectMonthOutboundCellProps) => {
  const dispatch = useDispatch();

  const dispatcher = (orderNr: string) => {
    dispatch(patchProjectsMonth({...projectMonth.details, orderNr}));
  };
  const [orderNr, setOrderNr, saveOrderNr] = useDebouncedSave<string>(projectMonth.details.orderNr || '', dispatcher);


  const toggleValid = (verified: boolean) => {
    dispatch(patchProjectsMonth({...projectMonth.details, verified: verified ? 'forced' : false}));
  };



  const ValidityToggle = (
    <ValidityToggleButton
      value={!!projectMonth.details.verified}
      onChange={() => toggleValid(!projectMonth.details.verified)}
      outline
      title={t('projectMonth.forceVerified')}
    />
  );



  if (projectMonth.details.verified === 'forced') {
    return (
      <div className="outbound-cell validated">
        <div />
        {ValidityToggle}
      </div>
    );
  }




  if (!projectMonth.invoice && projectMonth.project.projectMonthConfig.changingOrderNr) {
    return (
      <div className="outbound-cell">
        <div className="split-orderNr">
          <StringInput
            value={orderNr}
            onChange={nr => setOrderNr(nr)}
            placeholder={t('invoice.orderNrShort')}
          />
          <CreateInvoiceButton projectMonth={projectMonth} />
        </div>
        {ValidityToggle}
      </div>
    );
  }


  if (!projectMonth.invoice) {
    return (
      <div className="outbound-cell">
        <CreateInvoiceButton projectMonth={projectMonth} />
        {ValidityToggle}
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
      orderNr: projectMonth.details.orderNr || projectMonth.project.client.ref,
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
    && (!projectMonth.project.projectMonthConfig.changingOrderNr || projectMonth.details.orderNr)
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
