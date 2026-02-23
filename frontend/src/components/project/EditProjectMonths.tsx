import {useState, useMemo, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router';
import {Container, Row, Form, Col} from 'react-bootstrap';
import {useAppDispatch} from '../hooks/useAppDispatch';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {deleteProjectsMonth, patchProjectsMonth} from '../../actions';
import {StickyFooter} from '../controls/other/StickyFooter';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Audit} from '../admin/audit/Audit';
import {Claim} from '../users/models/UserModel';
import {getNewProjectMonth} from './models/getNewProject';
import {ProjectMonthModel} from './models/ProjectMonthModel';
import {projectMonthFormProperties} from './models/ProjectFormConfig';
import {useProjectsMonth} from '../hooks/useProjects';
import {EnhanceWithConfirmation} from '../enhancers/EnhanceWithConfirmation';
import {Button} from '../controls/form-controls/Button';
import useEntityChangedToast from '../hooks/useEntityChangedToast';
import {FullFormConfig, FormConfig} from '../../models';
import {NotesWithCommentsModalButton} from '../controls/form-controls/button/NotesWithCommentsModalButton';

const ConfirmationButton = EnhanceWithConfirmation(Button);

type ProformaToggleProps = {
  checked: boolean;
  onChange: (enabled: boolean) => void;
};

const ProformaToggle = ({checked, onChange}: ProformaToggleProps) => (
  <label className="form-check form-switch">
    <input
      className="form-check-input"
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="form-check-label" style={{marginLeft: '0.5rem'}}>
      {t('projectMonth.props.inbound.enableProforma')}
    </span>
  </label>
);

export const EditProjectMonths = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const model = useProjectsMonth(params.projectMonthId);
  const [projectMonth, setProjectMonth] = useState<ProjectMonthModel>((model && model.details) || getNewProjectMonth());

  useEntityChangedToast(projectMonth._id);

  const docTitle = projectMonth._id ? 'projectMonthEdit' : 'projectMonthNew';
  const consultantName = (model && model.consultantName) || '';
  const clientName = (model && model.client.name) || '';
  useDocumentTitle(docTitle, {consultantName, clientName});
  const navigate = useNavigate();

  if (model && !projectMonth._id) {
    setProjectMonth(model.details);
  }

  const hasProforma = !!projectMonth.inbound.proforma;

  const toggleProforma = useCallback((enabled: boolean) => {
    setProjectMonth(prev => {
      if (enabled) {
        return {
          ...prev,
          inbound: {
            ...prev.inbound,
            proforma: {status: 'new'}
          }
        };
      } else {
        const {proforma: _proforma, ...inboundWithoutProforma} = prev.inbound;
        return {
          ...prev,
          inbound: inboundWithoutProforma
        };
      }
    });
  }, []);

  const formConfig: FullFormConfig = useMemo(() => {
    const config = [...projectMonthFormProperties];
    const proformaHeaderIndex = config.findIndex(field => {
      if (typeof field === 'string' || !field || typeof field !== 'object') {
        return false;
      }
      const formConfigField = field as FormConfig;
      return formConfigField.title && typeof formConfigField.title === 'object'
        && formConfigField.title.title === 'projectMonth.props.proforma.title';
    });

    if (proformaHeaderIndex !== -1) {
      // Insert the toggle right after the Proforma header
      const toggleConfig: FormConfig = {
        key: '__proforma_toggle__',
        component: ProformaToggle,
        cols: 12,
        props: {
          checked: hasProforma,
          onChange: toggleProforma,
        },
      };

      const newConfig = [...config];
      newConfig.splice(proformaHeaderIndex + 1, 0, toggleConfig);

      if (!hasProforma) {
        // Remove the proforma status field if proforma is not enabled
        return newConfig.filter(field => {
          if (typeof field === 'string' || !field || typeof field !== 'object') {
            return true;
          }
          const formConfigField = field as FormConfig;
          return formConfigField.key !== 'inbound.proforma.status';
        });
      }
      return newConfig;
    }
    return config;
  }, [hasProforma, toggleProforma]);

  return (
    <Container className="edit-container">
      <Form>
        <Row className="page-title-container">
          <h1>{model ? `${model.consultantName} @ ${clientName}` : t('titles.projectMonthNew')}</h1>
          <Audit model={model?.details} modelType="projectMonth" />
        </Row>
        <Row>
          <ArrayInput
            config={formConfig}
            model={projectMonth}
            onChange={(value: Partial<ProjectMonthModel>) => setProjectMonth({...projectMonth, ...value})}
            tPrefix="projectMonth.props."
          />
        </Row>
        <Row style={{marginTop: '2rem'}}>
          <Col xs={6}>
            <h3>{t('projectMonth.timesheetNotes')}</h3>
            <NotesWithCommentsModalButton
              claim={Claim.EditProjectMonth}
              value={{note: projectMonth.timesheet.note, comments: projectMonth.timesheet.comments}}
              onChange={val => setProjectMonth({
                ...projectMonth,
                timesheet: {...projectMonth.timesheet, note: val.note, comments: val.comments}
              })}
              title={t('projectMonth.timesheetNotes')}
              showNote
              variant="outline-primary"
              style={{width: '100%'}}
            />
          </Col>
          <Col xs={6}>
            <h3>{t('projectMonth.invoiceNotes')}</h3>
            <NotesWithCommentsModalButton
              claim={Claim.EditProjectMonth}
              value={{note: projectMonth.note, comments: projectMonth.comments}}
              onChange={val => setProjectMonth({...projectMonth, note: val.note, comments: val.comments})}
              title={t('projectMonth.invoiceNotes')}
              showNote
              variant="outline-primary"
              style={{width: '100%'}}
            />
          </Col>
        </Row>
      </Form>
      <StickyFooter>
        <ConfirmationButton
          className="tst-confirm-delete-project-month"
          onClick={() => dispatch(deleteProjectsMonth(projectMonth._id, navigate))}
          variant="danger"
          title={t('projectMonth.deleteConfirm.title')}
          componentChildren={t('delete')}
          claim={Claim.DeleteProjectMonth}
        >
          {t('projectMonth.deleteConfirm.content')}
        </ConfirmationButton>
        <BusyButton
          className="tst-validate-project-month"
          onClick={() => dispatch(patchProjectsMonth(projectMonth))}
          claim={Claim.ValidateProjectMonth}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
