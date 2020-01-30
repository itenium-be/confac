import React from 'react';
import {useSelector} from 'react-redux';
import Select from 'react-select';
import {t} from '../../utils';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {ConfacState} from '../../../reducers/app-state';
import {ConsultantModel} from '../models/ConsultantModel';
import {SelectItem} from '../../../models';


type ConsultantSelectProps = {
  /** The consultant _id */
  value: string | ConsultantModel,
  onChange: (consultantId: string, consultant: ConsultantModel) => void,
}

const ConsultantSelectComponent = (props: ConsultantSelectProps) => {
  const consultants = useSelector((state: ConfacState) => state.consultants);
  const {value} = props;

  const getConsultant = (consultantId: string): ConsultantModel => consultants.find(c => c._id === consultantId) as ConsultantModel;
  const getConsultantDesc = (c: ConsultantModel) => `${c.firstName} ${c.name} (${t(`consultant.types.${c.type}`)})`;

  const selectedConsultantId = value && typeof value === 'object' ? value._id : value;
  const options: SelectItem[] = consultants
    .sort((a, b) => getConsultantDesc(a).localeCompare(getConsultantDesc(b)))
    .map(item => ({value: item._id, label: getConsultantDesc(item)} as SelectItem));

  const selectedOption = options.find(o => o.value === selectedConsultantId);

  return (
    <Select
      value={selectedOption}
      options={options as any}
      onChange={((item: SelectItem) => props.onChange(item && item.value as string, item && getConsultant(item.value as string))) as any}
      isClearable
      placeholder={t('controls.selectPlaceholder')}
    />
  );
};

export const ConsultantSelect = EnhanceInputWithLabel(ConsultantSelectComponent);
