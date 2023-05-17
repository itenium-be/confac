import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {IProjectModel} from './models/IProjectModel';
import {Button} from '../controls/form-controls/Button';
import {t} from '../utils';
import {Modal} from '../controls/Modal';
import {saveProject} from '../../actions/projectActions';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {FullFormConfig} from '../../models';
import { ContractStatus } from '../client/models/ContractModels';

type CopyProjectProps = {
  projectToCopy: IProjectModel;
}



export const copyProjectProperties: FullFormConfig = [
  {key: 'startDate', component: 'date', cols: 6},
  {key: 'endDate', component: 'date', cols: 6},
  {title: {title: 'client.notes', level: 4}},
  {key: 'notes', label: '', component: 'TextEditor', cols: 12},
];


export const CopyProject = ({projectToCopy}: CopyProjectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const defaultProject = {
    ...projectToCopy,
    _id: '',
    startDate: moment(projectToCopy.endDate).add(1, 'day'),
    endDate: undefined,
    contract: {...projectToCopy.contract, status: ContractStatus.NoContract}
  };
  const [project, setProject] = useState<IProjectModel>(defaultProject);
  const dispatch = useDispatch();
  const history = useNavigate();


  return (
    <>
      {open && (
        <Modal
          show
          onClose={() => setOpen(false)}
          onConfirm={() => dispatch(saveProject(project, history, 'to-details') as any)}
          title={t('project.copy.modalTitle')}
        >
          <div className="container">
            <div className="row">
              <ArrayInput
                config={copyProjectProperties}
                model={project}
                onChange={value => setProject({...project, ...value})}
                tPrefix="project.copy."
              />
            </div>
          </div>
        </Modal>
      )}
      <Button onClick={() => setOpen(!open)} variant="light">
        {t('project.copy.buttonText')}
      </Button>
    </>
  );
};
