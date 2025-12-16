import {useSelector} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {t} from '../../utils';
import {BaseModalProps, Modal} from '../../controls/Modal';
import {IProjectModel} from '../models/IProjectModel';
import {ConfacState} from '../../../reducers/app-state';
import {ConsultantLink} from '../../consultant/controls/ConsultantLink';
import {Link} from 'react-router';


type ProjectModalProps = BaseModalProps & {
  project: IProjectModel;
}


export const ProjectModal = ({project, show, onClose}: ProjectModalProps) => {
  const consultant = useSelector((state: ConfacState) => state.consultants.find(c => c._id === project.consultantId));
  const client = useSelector((state: ConfacState) => state.clients.find(c => c._id === project.client.clientId));
  const partner = useSelector((state: ConfacState) =>
    project.partner?.clientId ? state.clients.find(c => c._id === project.partner?.clientId) : undefined
  );
  const accountManager = useSelector((state: ConfacState) =>
    project.accountManager ? state.user.users.find(u => u._id === project.accountManager) : undefined
  );

  const title = consultant && client
    ? `${consultant.firstName} ${consultant.name} @ ${client.name}`
    : t('project.project');

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={title}
    >
      <Container>
        <Row className="mb-2">
          <Col sm={4}><strong>{t('project.consultant')}</strong></Col>
          <Col sm={8}>
            {consultant ? <ConsultantLink consultant={consultant} /> : '-'}
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4}><strong>{t('project.client.clientId')}</strong></Col>
          <Col sm={8}>
            {client ? <Link to={`/clients/${client.slug}`}>{client.name}</Link> : '-'}
          </Col>
        </Row>
        {partner && (
          <Row className="mb-2">
            <Col sm={4}><strong>{t('project.partner.clientId')}</strong></Col>
            <Col sm={8}>
              <Link to={`/clients/${partner.slug}`}>{partner.name}</Link>
            </Col>
          </Row>
        )}
        <Row className="mb-2">
          <Col sm={4}><strong>{t('project.startDate')}</strong></Col>
          <Col sm={8}>{project.startDate?.format('DD/MM/YYYY') || '-'}</Col>
        </Row>
        {project.endDate && (
          <Row className="mb-2">
            <Col sm={4}><strong>{t('project.endDate')}</strong></Col>
            <Col sm={8}>{project.endDate.format('DD/MM/YYYY')}</Col>
          </Row>
        )}
        {accountManager && (
          <Row className="mb-2">
            <Col sm={4}><strong>{t('project.accountManager')}</strong></Col>
            <Col sm={8}>{accountManager.alias}</Col>
          </Row>
        )}
        {project.client.ref && (
          <Row className="mb-2">
            <Col sm={4}><strong>{t('project.client.ref')}</strong></Col>
            <Col sm={8}>{project.client.ref}</Col>
          </Row>
        )}
        <Row className="mt-3">
          <Col>
            <Link to={`/projects/${project._id}`} className="btn btn-outline-primary btn-sm">
              {t('project.openDetails')}
            </Link>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
};
