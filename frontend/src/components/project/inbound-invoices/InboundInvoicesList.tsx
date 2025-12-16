import {useState} from 'react';
import {Container} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import moment, {Moment} from 'moment';
import {ConfacState} from '../../../reducers/app-state';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {PeriodPicker} from '../../home/measurements/PeriodPicker';
import {t} from '../../utils';
import {InboundInvoicesTable} from './InboundInvoicesTable';
import {EnhanceWithClaim} from '../../enhancers/EnhanceWithClaim';
import {BaseSelect} from '../../controls/form-controls/select/BaseSelect';
import {SelectItem} from '../../../models';

export interface DateRange {
  from: Moment;
  to: Moment;
}

const InboundInvoicesListComponent = () => {
  // Initialize date range: last 12 months
  const [dateRange, setDateRange] = useState<DateRange>({
    from: moment().subtract(12, 'months').startOf('month'),
    to: moment().endOf('month'),
  });

  const [selectedConsultantId, setSelectedConsultantId] = useState<string>('');

  // Get all data from Redux
  const projectsMonth = useSelector((state: ConfacState) => state.projectsMonth);
  const projects = useSelector((state: ConfacState) => state.projects);
  const consultants = useSelector((state: ConfacState) => state.consultants);
  const clients = useSelector((state: ConfacState) => state.clients);
  const invoices = useSelector((state: ConfacState) => state.invoices);
  const user = useSelector((state: ConfacState) => state.user);

  // Build full project months with all resolved references
  const fullProjectMonths: FullProjectMonthModel[] = projectsMonth
    .map(pm => {
      const project = projects.find(p => p._id === pm.projectId);
      if (!project) return null;

      const consultant = consultants.find(c => c._id === project.consultantId);
      const client = clients.find(c => c._id === project.client.clientId);
      const partner = project.partner?.clientId
        ? clients.find(c => c._id === project.partner?.clientId)
        : undefined;
      const invoice = invoices.find(i => i.projectMonth?.projectMonthId === pm._id);
      const accountManager = project.accountManager ? user.users.find(u => u._id === project.accountManager) : undefined;

      if (!consultant || !client) return null;

      return {
        details: pm,
        project,
        consultant,
        client,
        partner,
        invoice,
        accountManager,
      } as FullProjectMonthModel;
    })
    .filter(x => x !== null) as FullProjectMonthModel[];

  // Filter: only projects with inbound invoice config and date range
  const dateFilteredProjectMonths = fullProjectMonths
    .filter(pm => pm.project.projectMonthConfig.inboundInvoice)
    .filter(pm => pm.details.inbound?.nr) // Has invoice number
    .filter(pm => {
      const dateToCheck = pm.details.inbound.dateReceived || pm.details.month;
      return dateToCheck.isSameOrAfter(dateRange.from, 'day')
        && dateToCheck.isSameOrBefore(dateRange.to, 'day');
    });

  // Filter: selected consultant
  const filteredProjectMonths = dateFilteredProjectMonths
    .filter(pm => !selectedConsultantId || pm.consultant._id === selectedConsultantId);

  // Build consultant options for dropdown - only show consultants that have inbound invoices in date range
  const consultantOptions: SelectItem[] = [
    {value: '', label: t('inboundInvoices.allConsultants')},
    ...consultants
      .filter(c => dateFilteredProjectMonths.some(pm => pm.consultant._id === c._id))
      .map(c => ({
        value: c._id,
        label: `${c.firstName} ${c.name}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const selectedConsultantOption = consultantOptions.find(o => o.value === selectedConsultantId) || consultantOptions[0];

  return (
    <Container className="inbound-invoices-list">
      <h1>{t('inboundInvoices.title')}</h1>

      <div className="filters-toolbar" style={{marginBottom: 20, display: 'flex', gap: 20, alignItems: 'center'}}>
        <PeriodPicker dateRange={dateRange} setDateRange={setDateRange} />
        <div style={{minWidth: 250}}>
          <BaseSelect
            value={selectedConsultantOption}
            onChange={(item: SelectItem) => setSelectedConsultantId(String(item?.value || ''))}
            options={consultantOptions}
          />
        </div>
      </div>

      <InboundInvoicesTable projectMonths={filteredProjectMonths} />
    </Container>
  );
};

export const InboundInvoicesList = EnhanceWithClaim(InboundInvoicesListComponent);
