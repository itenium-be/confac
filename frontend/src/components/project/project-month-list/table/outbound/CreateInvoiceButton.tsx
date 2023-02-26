import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FullProjectMonthModel } from '../../../models/FullProjectMonthModel';
import { createInvoice, deleteProjectMonthAttachmentDetails } from '../../../../../actions';
import { Button } from '../../../../controls/form-controls/Button';
import { Icon } from '../../../../controls/Icon';
import { t, moneyFormat } from '../../../../utils';
import { ConfacState } from '../../../../../reducers/app-state';
import { getNewInvoice, NewInvoiceType } from '../../../../invoice/models/getNewInvoice';
import InvoiceModel from '../../../../invoice/models/InvoiceModel';
import { Claim } from '../../../../users/models/UserModel';
import { ClaimGuard } from '../../../../enhancers/EnhanceWithClaim';
import { InvoiceLine } from '../../../../invoice/models/InvoiceLineModels';

interface CreateInvoiceButtonProps {
  fullProjectMonth: FullProjectMonthModel;
}

export const CreateInvoiceButton = ({ fullProjectMonth }: CreateInvoiceButtonProps) => {
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
        <Icon fa="fa fa-file-invoice" size={1} style={{ marginRight: 8 }} />
        {t('projectMonth.outboundCreateInvoice')}
      </Button>
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
