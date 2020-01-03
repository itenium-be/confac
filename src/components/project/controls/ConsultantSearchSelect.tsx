import React from 'react';
import { connect } from 'react-redux';
import { t } from '../../util';
import { EnhanceInputWithLabel } from '../../enhancers/EnhanceInputWithLabel';
import Select from 'react-select';
import { ConfacState } from '../../../reducers/app-state';
import { ConsultantModel } from '../../consultant/models';
import { SelectItem } from '../../../models';


type ConsultantSelectProps = {
  consultants: ConsultantModel[],
  /**
   * The consultant _id
   */
  value: string,
  onChange: (consultantId: string, consultant: ConsultantModel) => void,
}

const _ConsultantSearchSelect = (props: ConsultantSelectProps) => {
  const { value, consultants } = props;

  const getConsultant = (consultantId: string): ConsultantModel => {
    return props.consultants.find(c => c._id === consultantId) as ConsultantModel;
  }

  const selectedConsultantId = value && typeof value === 'object' ? value['_id'] : value;

  const options: SelectItem[] = consultants
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(item => ({ value: item._id, label: item.name } as SelectItem));

  const selectedOption = options.find(o => o.value === selectedConsultantId);

  return (
    <Select
      value={selectedOption}
      options={options as any}
      onChange={((item: SelectItem) => props.onChange(item && item.value as string, item && getConsultant(item.value as string))) as any}
      isClearable={true}
      placeholder={t('controls.selectPlaceholder')}
      className="tst-client-select"
    />
  );
}

export const ConsultantSearchSelect = EnhanceInputWithLabel(connect((state: ConfacState) => ({ consultants: state.consultants }))(_ConsultantSearchSelect));
