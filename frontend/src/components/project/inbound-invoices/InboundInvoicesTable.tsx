import {Table} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {addPartnerRate} from '../utils/getTariffs';
import {moneyFormat, t} from '../../utils';
import {Icon} from '../../controls/Icon';
import {getDownloadUrl} from '../../../actions/utils/download-helpers';
import {InboundInvoiceAttachmentType, ProformaInvoiceAttachmentType, SignedTimesheetAttachmentType} from '../../../models';
import {Link} from 'react-router';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ProjectLinkWithModal} from '../controls/ProjectLinkWithModal';
import InvoiceModel from '../../invoice/models/InvoiceModel';

interface InboundInvoicesTableProps {
  projectMonths: FullProjectMonthModel[];
}

interface GroupedInvoices {
  consultant: ConsultantModel;
  invoices: FullProjectMonthModel[];
  totalWithoutTax: number;
  totalWithTax: number;
  totalDays: number;
}

export const InboundInvoicesTable = ({projectMonths}: InboundInvoicesTableProps) => {
  const tax = useSelector((state: ConfacState) => state.config.defaultInvoiceLines[0].tax);
  const allInvoices = useSelector((state: ConfacState) => state.invoices);

  // Group by consultant
  const groupedByConsultant = projectMonths.reduce((acc, pm) => {
    const consultantId = pm.consultant._id;
    if (!acc[consultantId]) {
      acc[consultantId] = {
        consultant: pm.consultant,
        invoices: [],
        totalWithoutTax: 0,
        totalWithTax: 0,
        totalDays: 0,
      };
    }

    acc[consultantId].invoices.push(pm);
    return acc;
  }, {} as Record<string, GroupedInvoices>);

  // Calculate totals per group
  Object.values(groupedByConsultant).forEach(group => {
    group.invoices.forEach(pm => {
      const {timesheet} = pm.details;
      // Always sum days
      group.totalDays += timesheet.timesheet || 0;

      // Only calculate amounts when there's a partner
      if (timesheet.timesheet && pm.project.partner) {
        const amountWithoutTax = addPartnerRate(timesheet.timesheet, pm);
        const addTax = !pm.partner?.country?.trim() || pm.partner.country === 'BE';
        const amountWithTax = addTax ? amountWithoutTax * (1 + tax / 100) : amountWithoutTax;

        group.totalWithoutTax += amountWithoutTax;
        group.totalWithTax += amountWithTax;
      }
    });
  });

  const groups = Object.values(groupedByConsultant).sort((a, b) =>
    `${a.consultant.firstName} ${a.consultant.name}`.localeCompare(
      `${b.consultant.firstName} ${b.consultant.name}`
    )
  );

  // Grand totals
  const grandTotalWithoutTax = groups.reduce((sum, g) => sum + g.totalWithoutTax, 0);
  const grandTotalWithTax = groups.reduce((sum, g) => sum + g.totalWithTax, 0);
  const grandTotalDays = groups.reduce((sum, g) => sum + g.totalDays, 0);

  return (
    <>
      {groups.map(group => (
        <div key={group.consultant._id} style={{marginBottom: 40}}>
          <h3 style={{marginBottom: 10}}>
            {group.consultant.firstName} {group.consultant.name}
          </h3>
          <Table bordered hover size="sm" className="inbound-invoices-table">
            <thead>
              <tr>
                <th>{t('inboundInvoices.month')}</th>
                <th>{t('inboundInvoices.project')}</th>
                <th>{t('inboundInvoices.proformaStatus')}</th>
                <th>{t('inboundInvoices.invoiceNr')}</th>
                <th>{t('inboundInvoices.invoiceDate')}</th>
                <th>{t('inboundInvoices.status')}</th>
                <th>{t('inboundInvoices.days')}</th>
                <th style={{textAlign: 'right'}}>{t('inboundInvoices.amountWithoutTax')}</th>
                <th style={{textAlign: 'right'}}>{t('inboundInvoices.amountWithTax')}</th>
                <th>{t('inboundInvoices.invoice')}</th>
                <th>{t('inboundInvoices.ourInvoice')}</th>
              </tr>
            </thead>
            <tbody>
              {group.invoices
                .sort((a, b) => a.details.month.diff(b.details.month))
                .map(pm => {
                  const {details, project, partner} = pm;
                  const {inbound, timesheet} = details;

                  // Calculate amounts
                  let amountWithoutTax = 0;
                  let amountWithTax = 0;
                  if (timesheet.timesheet && project.partner) {
                    amountWithoutTax = addPartnerRate(timesheet.timesheet, pm);
                    const addTax = !partner?.country?.trim() || partner.country === 'BE';
                    amountWithTax = addTax ? amountWithoutTax * (1 + tax / 100) : amountWithoutTax;
                  }

                  // Get attachments - check invoice first, then project month
                  const attachments = pm.invoice?.attachments || details.attachments;
                  const inboundAttachment = attachments.find(a => a.type === InboundInvoiceAttachmentType);
                  const proformaAttachment = details.attachments.find(
                    a => a.type === ProformaInvoiceAttachmentType
                  );
                  const timesheetAttachment = pm.invoice?.attachments.find(a => a.type === SignedTimesheetAttachmentType)
                    || details.attachments.find(a => a.type === SignedTimesheetAttachmentType);

                  const getInboundInvoiceUrl = () => {
                    if (!inboundAttachment) return '';
                    if (pm.invoice?.attachments.find(a => a.type === InboundInvoiceAttachmentType)) {
                      return getDownloadUrl('invoice', pm.invoice._id, InboundInvoiceAttachmentType, inboundAttachment.fileName, 'download');
                    }
                    return getDownloadUrl('project_month', details._id, InboundInvoiceAttachmentType, inboundAttachment.fileName, 'download');
                  };

                  const getTimesheetUrl = () => {
                    if (!timesheetAttachment) return '';
                    if (pm.invoice?.attachments.find(a => a.type === SignedTimesheetAttachmentType)) {
                      return getDownloadUrl('invoice', pm.invoice._id, SignedTimesheetAttachmentType, timesheetAttachment.fileName, 'preview');
                    }
                    return getDownloadUrl('project_month', details._id, SignedTimesheetAttachmentType, timesheetAttachment.fileName, 'preview');
                  };

                  return (
                    <tr key={details._id}>
                      <td>{details.month.format('MMMM YYYY')}</td>
                      <td>
                        <ProjectLinkWithModal project={project} displayText={pm.client.name} />
                      </td>
                      <td>
                        {inbound.proforma && (
                          <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                            <span className={`badge rounded-pill text-white bg-${getProformaStatusColor(inbound.proforma.status)}`}>
                              {t(`projectMonth.proforma.status.${inbound.proforma.status}`)}
                            </span>
                            {proformaAttachment && (
                              <Icon
                                fa="fas fa-file-alt"
                                title={t('inboundInvoices.viewProforma')}
                                href={getDownloadUrl(
                                  'project_month',
                                  details._id,
                                  ProformaInvoiceAttachmentType,
                                  proformaAttachment.fileName,
                                  'preview'
                                )}
                                style={{fontSize: '0.9em'}}
                              />
                            )}
                          </div>
                        )}
                      </td>
                      <td>{inbound.nr || '-'}</td>
                      <td>{inbound.dateReceived ? inbound.dateReceived.format('DD/MM/YYYY') : '-'}</td>
                      <td>
                        <span className={`badge rounded-pill text-white bg-${getStatusColor(inbound.status)}`}>
                          {t(`projectMonth.inbound.status.${inbound.status}`)}
                        </span>
                      </td>
                      <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                          {timesheet.timesheet || '-'}
                          {timesheetAttachment && (
                            <Icon
                              fa="fas fa-file-alt"
                              title={t('inboundInvoices.viewTimesheet')}
                              href={getTimesheetUrl()}
                              style={{fontSize: '0.9em'}}
                            />
                          )}
                        </div>
                      </td>
                      <td style={{textAlign: 'right'}}>{moneyFormat(amountWithoutTax)}</td>
                      <td style={{textAlign: 'right'}}>{moneyFormat(amountWithTax)}</td>
                      <td>
                        {inboundAttachment && (
                          <Icon
                            fa="fas fa-download"
                            title={t('inboundInvoices.downloadInvoice')}
                            href={getInboundInvoiceUrl()}
                            style={{fontSize: '0.9em'}}
                          />
                        )}
                      </td>
                      <td>
                        {pm.invoice && (
                          <>
                            {pm.invoice.creditNotas?.length > 0 ? (
                              [pm.invoice, ...pm.invoice.creditNotas
                                .map(id => allInvoices.find(inv => inv._id === id))
                                .filter((inv): inv is InvoiceModel => inv !== undefined)]
                                .sort((a, b) => a.number - b.number)
                                .map((inv, idx, arr) => (
                                  <span key={inv._id}>
                                    <Link to={`/invoices/${inv._id}`}>#{inv.number}</Link>
                                    {idx < arr.length - 1 && ', '}
                                  </span>
                                ))
                            ) : (
                              <Link to={`/invoices/${pm.invoice._id}`}>
                                #{pm.invoice.number}
                              </Link>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr style={{fontWeight: 'bold', backgroundColor: '#f8f9fa'}}>
                <td colSpan={6}>{t('inboundInvoices.subtotal')}</td>
                <td>{group.totalDays.toFixed(2)}</td>
                <td style={{textAlign: 'right'}}>{moneyFormat(group.totalWithoutTax)}</td>
                <td style={{textAlign: 'right'}}>{moneyFormat(group.totalWithTax)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </Table>
        </div>
      ))}

      {groups.length > 1 && (
        <div style={{marginTop: 30}}>
          <Table bordered size="sm" style={{maxWidth: 600, marginLeft: 'auto'}}>
            <thead>
              <tr>
                <th colSpan={3} style={{textAlign: 'center', fontSize: '1.1em'}}>
                  {t('inboundInvoices.grandTotal')}
                </th>
              </tr>
              <tr>
                <th>{t('inboundInvoices.days')}</th>
                <th style={{textAlign: 'right'}}>{t('inboundInvoices.amountWithoutTax')}</th>
                <th style={{textAlign: 'right'}}>{t('inboundInvoices.amountWithTax')}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{fontWeight: 'bold'}}>
                <td>{grandTotalDays.toFixed(2)}</td>
                <td style={{textAlign: 'right'}}>{moneyFormat(grandTotalWithoutTax)}</td>
                <td style={{textAlign: 'right'}}>{moneyFormat(grandTotalWithTax)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

function getStatusColor(status: string): string {
  switch (status) {
    case 'paid':
      return 'success';
    case 'validated':
      return 'info';
    case 'new':
    default:
      return 'warning';
  }
}

function getProformaStatusColor(status: string): string {
  switch (status) {
    case 'verified':
      return 'success';
    case 'new':
    default:
      return 'warning';
  }
}
