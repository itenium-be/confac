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

const ConsultantSelectComponent = ({value, onChange}: ConsultantSelectProps) => {
  const selectedModelId = value && typeof value === 'object' ? value._id : value;
  const models = useSelector((state: ConfacState) => state.consultants.filter(x => x.active || x._id === selectedModelId));
  const getModel = (consultantId: string): ConsultantModel => models.find(c => c._id === consultantId) as ConsultantModel;

  const options: SelectItem[] = models
    .map(x => ({value: x._id, label: `${x.firstName} ${x.name} (${t(`consultant.types.${x.type}`)})`} as SelectItem))
    .sort((a, b) => (a.label as string).localeCompare(b.label as string));

  const selectedOption = options.find(o => o.value === selectedModelId);

  return (
    <Select
      value={selectedOption}
      options={options as any}
      onChange={((item: SelectItem) => onChange(item && item.value as string, item && getModel(item.value as string))) as any}
      isClearable
      placeholder={t('controls.selectPlaceholder')}
      className="react-select-consultant"
      classNamePrefix="react-select"
    />
  );
};

export const ConsultantSelect = EnhanceInputWithLabel(ConsultantSelectComponent);
