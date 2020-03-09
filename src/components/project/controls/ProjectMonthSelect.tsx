import React from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import Select from 'react-select';
import {t} from '../../utils';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {ConfacState} from '../../../reducers/app-state';
import {SelectItem} from '../../../models';
import {projectMonthResolve, displayMonthWithYear} from '../ProjectMonthsLists';
import {FullProjectMonthModel} from '../models/ProjectMonthModel';
import InvoiceModel from '../../invoice/models/InvoiceModel';


type ProjectMonthSelectProps = {
  /** The project _id */
  value: string,
  onChange: (fullProjectMonth: FullProjectMonthModel) => void,
}

const ProjectMonthSelectComponent = (props: ProjectMonthSelectProps) => {
  const fullProjectsMonth = useSelector((state: ConfacState) => state.projectsMonth.map(pm => projectMonthResolve(pm, state)));
  const invoices = useSelector((state: ConfacState) => state.invoices);
  const urlParams: {id: string} = useParams();

  const {value: selectedProjectMonthId} = props;

  const getFullProjectMonth = (projectMonthId: string): FullProjectMonthModel => fullProjectsMonth
    .find(fpm => fpm._id === projectMonthId) as FullProjectMonthModel;

  const getProjectMonthDesc = (fpm: FullProjectMonthModel): string => {
    const {consultant, details, client, partner} = fpm;
    return (
      `${displayMonthWithYear(details)} - ${consultant.firstName} ${consultant.name} - ${partner ? `${partner.name} / ` : ''}${client.name}`
    );
  };

  const getCurrentInvoice = (invoiceNumber: string): InvoiceModel => invoices.find(i => i.number === +invoiceNumber)!;

  const currentInvoice = urlParams.id ? getCurrentInvoice(urlParams.id) : null;

  const options: SelectItem[] = fullProjectsMonth
    .filter(fpm => ((currentInvoice && currentInvoice.projectMonthId) === fpm._id) || !fpm.invoice)
    .filter(fpm => !fpm.details.attachments.length)
    .sort((a, b) => getProjectMonthDesc(a).localeCompare(getProjectMonthDesc(b)))
    .map(item => ({value: item._id, label: getProjectMonthDesc(item)} as SelectItem));

  const selectedOption = options.find(o => o.value === selectedProjectMonthId);

  return (
    <Select
      value={selectedOption}
      options={options as any}
      onChange={((item: SelectItem) => item && props.onChange(getFullProjectMonth(item.value as string))) as any}
      isClearable
      placeholder={t('controls.selectPlaceholder')}
    />
  );
};

export const ProjectMonthSelect = EnhanceInputWithLabel(ProjectMonthSelectComponent);
