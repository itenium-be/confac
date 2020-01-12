import React from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import {t} from '../../utils';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {ConfacState} from '../../../reducers/app-state';
import {ConsultantModel} from '../../consultant/models';
import {SelectItem} from '../../../models';


type ConsultantSelectProps = {
  consultants: ConsultantModel[],
  /**
   * The consultant _id
   */
  value: string,
  onChange: (consultantId: string, consultant: ConsultantModel) => void,
}

const _ConsultantSearchSelect = (props: ConsultantSelectProps) => {
  const {value, consultants} = props;

  const getConsultant = (consultantId: string): ConsultantModel => props.consultants.find((c) => c._id === consultantId) as ConsultantModel;

  const getConsultantName = (c: ConsultantModel) => `${c.firstName} ${c.name} (${t(`consultant.types.${c.type}`)})`;

  const selectedConsultantId = value && typeof value === 'object' ? value._id : value;

  const options: SelectItem[] = consultants
    .sort((a, b) => getConsultantName(a).localeCompare(getConsultantName(b)))
    .map((item) => ({value: item._id, label: getConsultantName(item)} as SelectItem));

  const selectedOption = options.find((o) => o.value === selectedConsultantId);

  return (
    <Select
      value={selectedOption}
      options={options as any}
      onChange={((item: SelectItem) => props.onChange(item && item.value as string, item && getConsultant(item.value as string))) as any}
      isClearable
      placeholder={t('controls.selectPlaceholder')}
      className="tst-client-select"
    />
  );
};

export const ConsultantSearchSelect = EnhanceInputWithLabel(connect((state: ConfacState) => ({consultants: state.consultants}))(_ConsultantSearchSelect));
