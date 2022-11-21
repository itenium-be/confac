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
import {Link} from '../../controls/Link';
import {MonthPicker} from '../../controls/form-controls/MonthPicker';

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
  return newProjects;
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

  return (
    <Modal
      show={props.show}
      onClose={props.onClose}
      title={t('projectMonth.createProjects.title')}
      onConfirm={() => dispatch(createProjectsMonth(date, newProjects.map(x => x._id)) as any)}
    >
      <Form>
        <Container>
          <Row>
            <MonthPicker
              label={t('projectMonth.createProjects.selectMonth')}
              value={date}
              onChange={value => value && setDate(value)}
            />
          </Row>
          {newProjects && <ToBeCreated projects={newProjects} />}
        </Container>
      </Form>
    </Modal>
  );
};



const ToBeCreated = ({projects}: {projects: FullProjectModel[]}) => {
  const sortedProjects = projects.sort((a, b) => a.consultantName.localeCompare(b.consultantName));
  if (!sortedProjects.length) {
    return (
      <Row>
        <h3>{t('projectMonth.createProjects.noNewRecordsTitle')}</h3>
        {t('projectMonth.createProjects.noNewRecordsLabel')}
      </Row>
    );
  }

  return (
    <Row>
      <h5>{t('projectMonth.createProjects.newRecordsTitle')}</h5>
      <div className="col-12">
        <dl className="dl-box createProjectsMonth">
          {sortedProjects.map(newProject => <ProjectRow key={newProject._id} project={newProject} />)}
        </dl>
      </div>
    </Row>
  );
};


const ProjectRow = ({project}: {project: FullProjectModel}) => {
  return (
    <>
      <dt><Link claim={Claim.ViewProjects} to={`/projects/${project._id}`} label={project.consultantName} /></dt>
      <dd>
        <ProjectDurationSmall project={project.details} />
        <div className="clientName">{project.client.name}</div>
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
      >
        {t('project.newMonth')}
      </Button>
    </ClaimGuard>
  );
};
