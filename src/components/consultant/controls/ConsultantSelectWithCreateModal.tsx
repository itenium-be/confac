import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ModalState} from '../../controls/Modal';
import {t} from '../../utils';
import {ConsultantSelect} from './ConsultantSelect';
import {ConsultantModel} from '../models/ConsultantModel';
import {ConsultantModal} from './ConsultantModal';
import {ConfacState} from '../../../reducers/app-state';
import {saveConsultant} from '../../../actions/consultantActions';
import {SelectWithCreateButton, SelectWithCreateModalProps} from '../../controls/form-controls/select/SelectWithCreateButton';


export const ConsultantSelectWithCreateModal = ({value, onChange}: SelectWithCreateModalProps<ConsultantModel>) => {
  const dispatch = useDispatch();
  const [modalId, setModalId] = useState<ModalState>(null);
  const consultant = useSelector((state: ConfacState) => state.consultants.find(c => c._id === value));

  return (
    <>
      {modalId && (
        <ConsultantModal
          consultant={modalId !== 'create' ? consultant : null}
          show={!!modalId}
          onClose={() => setModalId(null)}
          onConfirm={(model: ConsultantModel) => dispatch(saveConsultant(model, savedModel => onChange(savedModel._id, savedModel)))}
        />
      )}
      <SelectWithCreateButton createButtonText="add" setModalId={setModalId}>
        <ConsultantSelect
          label={t('project.consultant')}
          value={value || ''}
          onChange={(id, model) => onChange(id, model)}
        />
      </SelectWithCreateButton>
    </>
  );
};
