import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {t} from '../../utils';
import {ConsultantSelect} from './ConsultantSelect';
import {ConsultantModel} from '../models/ConsultantModel';
import {ConsultantModal} from './ConsultantModal';
import {ConfacState} from '../../../reducers/app-state';
import {saveConsultant} from '../../../actions/consultantActions';
import {SelectWithCreateButton, SelectWithCreateModalProps} from '../../controls/form-controls/select/SelectWithCreateButton';
import {Claim} from '../../users/models/UserModel';
import {Form} from 'react-bootstrap';
import { ConsultantIconLinks } from "./ConsultantIconLinks";


export const ConsultantSelectWithCreateModal = ({value, onChange}: SelectWithCreateModalProps<ConsultantModel>) => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const consultant = useSelector((state: ConfacState) => state.consultants.find(c => c._id === value));

  return (
    <>
      {modalOpen && (
        <ConsultantModal
          consultant={null}
          show
          onClose={() => setModalOpen(false)}
          onConfirm={(model: ConsultantModel) => dispatch(saveConsultant(model, savedModel => onChange(savedModel._id, savedModel)) as any)}
        />
      )}
      <SelectWithCreateButton claim={Claim.ManageConsultants} createButtonText="add" openCreateModal={() => setModalOpen(true)}>
        <Form.Group className="form-group">
          <Form.Label>
            <span style={{marginRight: 8}}>{t('project.consultant')}</span>
            {consultant && <ConsultantIconLinks consultant={consultant} />}
          </Form.Label>
          <ConsultantSelect value={value || ''} onChange={(id, model) => onChange(id, model)} />
        </Form.Group>
      </SelectWithCreateButton>
    </>
  );
};
