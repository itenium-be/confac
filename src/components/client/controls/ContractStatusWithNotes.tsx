import React from 'react';
import {t} from '../../utils';
import {SimpleSelect} from '../../controls/form-controls/select/SimpleSelect';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import {ContractStatus, IContractModel} from '../models/ContractModels';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';

const options = [
  ContractStatus.NoContract,
  ContractStatus.Sent,
  ContractStatus.Verified,
  ContractStatus.TheySigned,
  ContractStatus.WeSigned,
  ContractStatus.BothSigned,
  ContractStatus.NotNeeded,
];


const ContractStatusSelect = ({value, label, ...props}: BaseInputProps<ContractStatus>) => (
  <SimpleSelect
    transFn={(key: string) => t(`contract.status.${key}`)}
    value={value}
    options={options}
    isClearable={false}
    label={label}
    placeholder=""
    {...props}
  />
);



const ContractStatusWithNotesComponent = ({value, label, onChange, ...props}: BaseInputProps<IContractModel>) => {
  const contract = value as IContractModel;
  return (
    <div style={{display: 'flex'}}>
      <div style={{flex: 1, marginRight: 6}}>
        <ContractStatusSelect
          label={undefined}
          value={contract.status}
          onChange={val => onChange({...value, status: val})}
        />
      </div>
      <NotesModalButton
        title={t('contract.notes')}
        value={contract.notes}
        onChange={val => onChange({...value, notes: val})}
      />
    </div>
  );
}

export const ContractStatusWithNotes = EnhanceInputWithLabel(ContractStatusWithNotesComponent);
