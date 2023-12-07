import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment, {Moment} from 'moment';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../../utils';
import {createProjectsMonth} from '../../../actions';
import {BaseModalProps, Modal, ModalState} from '../../controls/Modal';
import {Button} from '../../controls/form-controls/Button';
import {ClaimGuard} from '../../enhancers/EnhanceWithClaim';
import {Claim} from '../../users/models/UserModel';
import {ConfacState} from '../../../reducers/app-state';
import {useProjects} from '../../hooks/useProjects';
import {FullProjectModel} from '../models/FullProjectModel';
import {ProjectDurationSmall} from './ProjectDuration';
import {MonthPicker} from '../../controls/form-controls/MonthPicker';
import {CheckboxInput} from '../../controls/form-controls/inputs/CheckboxInput';

const toFirstDayOfMonth = (value: Moment): Moment => {
  const localMoment = moment(value).startOf('month').startOf('day');
  const utcMoment = localMoment.clone().utc().add(localMoment.utcOffset(), 'm');
  return utcMoment;
};

type ProjectMonthModalProps = BaseModalProps & {};


function useToBeCreatedProjects(month: Moment): FullProjectModel[] {
  const existingProjectsMonth = useSelector((state: ConfacState) => state.projectsMonth.filter(x => x.month.isSame(month, 'month')));
  const existingProjectIds = existingProjectsMonth.map(x => x.projectId);
  const activeProjects = useProjects(month).filter(x => x.isActiveInMonth(month));
  const newProjects = activeProjects.filter(prj => !existingProjectIds.includes(prj._id));
  return newProjects.sort((a, b) => a.consultantName.localeCompare(b.consultantName));
}



function useDefaultNewProjectMonth(): Moment {
  const projectsMonth = useSelector((state: ConfacState) => state.projectsMonth);
  if (!projectsMonth.length) {
    return moment();
  }

  const lastProjectMonth = projectsMonth.map(x => x.month).sort((a, b) => b.valueOf() - a.valueOf())[0];
  const lastMonth = moment().subtract(1, 'month');
  if (lastProjectMonth.isBefore(lastMonth)) {
    return lastMonth;
  }

  return moment();
}



/** Create projectMonths by selecting a project month */
export const CreateProjectsMonthModal = (props: ProjectMonthModalProps) => {
  const dispatch = useDispatch();
  const defaultNewMonth = toFirstDayOfMonth(useDefaultNewProjectMonth());
  const [date, setDate] = useState<moment.Moment>(defaultNewMonth);
  const newProjects = useToBeCreatedProjects(date);
  const initialSelection = newProjects.map(() => true);
  const [forceReload, setForceReload] = useState(false);
  const [toBeCreated, setToBeCreated] = useState(initialSelection);

  if (forceReload) {
    setForceReload(false);
    setToBeCreated(initialSelection);
  }

  const data = toBeCreated.map((selected, idx) => ({selected, prj: newProjects[idx]}));

  const getSelectedProjects = (): string[] => {
    return data.filter(p => p.selected).map(p => p.prj._id);
  }

  return (
    <Modal
      show={props.show}
      onClose={props.onClose}
      title={t('projectMonth.createProjects.title')}
      onConfirm={() => dispatch(createProjectsMonth(date, getSelectedProjects()) as any)}
    >
      <Form>
        <Container>
          <Row>
            <MonthPicker
              label={t('projectMonth.createProjects.selectMonth')}
              value={date}
              onChange={value => {value && setDate(value); value && setForceReload(true)}}
            />
          </Row>
          {newProjects && <ToBeCreated projects={data} setToBeCreated={setToBeCreated} />}
        </Container>
      </Form>
    </Modal>
  );
};


type ToBeCreatedModel = {prj: FullProjectModel, selected: boolean};


const ToBeCreated = ({projects, setToBeCreated}: {projects: ToBeCreatedModel[], setToBeCreated: Function}) => {
  if (!projects.length) {
    return (
      <Row>
        <h3>{t('projectMonth.createProjects.noNewRecordsTitle')}</h3>
        {t('projectMonth.createProjects.noNewRecordsLabel')}
      </Row>
    );
  }

  const updateToBeCreated = (newProject: ToBeCreatedModel, selected: boolean): void => {
    const updateIndex = projects.map(p => p.prj).indexOf(newProject.prj);
    const newValue = projects.map((prj, idx) => updateIndex === idx ? selected : prj.selected);
    setToBeCreated(newValue);
  }

  return (
    <Row>
      <h5>{t('projectMonth.createProjects.newRecordsTitle')}</h5>
      <div className="col-12">
        <dl className="dl-box createProjectsMonth">
          {projects.map(newProject => (
            <ProjectRow
              key={newProject.prj._id}
              project={newProject}
              onChange={selected => updateToBeCreated(newProject, selected)}
            />
          ))}
        </dl>
      </div>
    </Row>
  );
};


const ProjectRow = ({project, onChange}: {project: ToBeCreatedModel, onChange: (e: boolean) => void}) => {
  return (
    <>
      <dt>
        <CheckboxInput value={project.selected} onChange={onChange} label={(project.prj.consultantName)} />
      </dt>
      <dd>
        <ProjectDurationSmall project={project.prj.details} />
        <div className="clientName">{project.prj.client.name}</div>
      </dd>
    </>
  );
};




export const CreateProjectsMonthModalButton = () => {
  const [modalProjectMonthId, setModalProjectMonthId] = useState<ModalState>(null);
  return (
    <ClaimGuard claim={Claim.CreateProjectMonth}>
      {modalProjectMonthId && (
        <CreateProjectsMonthModal show={!!modalProjectMonthId} onClose={() => setModalProjectMonthId(null)} />
      )}
      <Button
        onClick={() => setModalProjectMonthId('create')}
        size="lg"
        variant="light"
        icon="fa fa-plus"
        className="tst-add-month"
      >
        {t('project.newMonth')}
      </Button>
    </ClaimGuard>
  );
};
