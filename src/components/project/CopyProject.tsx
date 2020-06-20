import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {ProjectModel} from './models/ProjectModel';
import {Button} from '../controls/form-controls/Button';
import {t} from '../utils';
import {Modal} from '../controls/Modal';
import {saveProject} from '../../actions/projectActions';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {FullFormConfig} from '../../models';

type CopyProjectProps = {
  projectToCopy: ProjectModel;
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
  };
  const [project, setProject] = useState<ProjectModel>(defaultProject);
  const dispatch = useDispatch();
  const history = useHistory();


  return (
    <>
      {open && (
        <Modal
          show
          onClose={() => setOpen(false)}
          onConfirm={() => dispatch(saveProject(project, history, 'to-details'))}
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
