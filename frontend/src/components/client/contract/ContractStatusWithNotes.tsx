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


const ContractStatusSelect = ({value, label, onChange, ...props}: BaseInputProps<ContractStatus>) => (
  <SimpleSelect
    transFn={(key: string) => t(`contract.status.${key}`)}
    value={value ?? ContractStatus.NoContract}
    options={options}
    isClearable={false}
    label={label}
    placeholder=""
    onChange={val => onChange(val as ContractStatus)}
    {...props}
  />
);



const ContractStatusWithNotesComponent = ({value, label: _label, onChange, ..._props}: BaseInputProps<IContractModel>) => {
  const contract: IContractModel = value ?? {status: ContractStatus.NoContract, notes: ''};
  return (
    <div style={{display: 'flex'}}>
      <div style={{flex: 1, marginRight: 6}}>
        <ContractStatusSelect
          label={undefined}
          value={contract.status}
          onChange={val => onChange({...contract, status: val as ContractStatus})}
        />
      </div>
      <NotesModalButton
        title={t('contract.notes')}
        value={contract.notes}
        onChange={val => onChange({...contract, notes: val})}
      />
    </div>
  );
};

export const ContractStatusWithNotes = EnhanceInputWithLabel(ContractStatusWithNotesComponent);
