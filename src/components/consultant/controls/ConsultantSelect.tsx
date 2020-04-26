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
  const models = useSelector((state: ConfacState) => state.consultants);
  const getModel = (consultantId: string): ConsultantModel => models.find(c => c._id === consultantId) as ConsultantModel;
  const getModelDesc = (c: ConsultantModel) => `${c.firstName} ${c.name} (${t(`consultant.types.${c.type}`)})`;

  const selectedModelId = value && typeof value === 'object' ? value._id : value;
  const options: SelectItem[] = models
    .filter(x => x.active || x._id === selectedModelId)
    .sort((a, b) => getModelDesc(a).localeCompare(getModelDesc(b)))
    .map(item => ({value: item._id, label: getModelDesc(item)} as SelectItem));

  const selectedOption = options.find(o => o.value === selectedModelId);

  return (
    <Select
      value={selectedOption}
      options={options as any}
      onChange={((item: SelectItem) => onChange(item && item.value as string, item && getModel(item.value as string))) as any}
      isClearable
      placeholder={t('controls.selectPlaceholder')}
    />
  );
};

export const ConsultantSelect = EnhanceInputWithLabel(ConsultantSelectComponent);
