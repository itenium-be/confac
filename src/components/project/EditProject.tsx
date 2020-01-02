import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container, Row, Form, Col } from "react-bootstrap";

import { ConfacState } from "../../reducers/app-state";
import { t } from "../util";
import { ArrayInput } from "../controls/form-controls/inputs/ArrayInput";
import { ProjectModel, projectFormConfig } from "./models";
import { BusyButton, Button } from "../controls";
import { ConsultantModal } from '../consultant/controls/ConsultantModal';
import { ConsultantSearchSelect } from "./controls";
import { saveProject } from "../../actions";
import { StickyFooter } from "../controls/skeleton/StickyFooter";

interface EditProjectProps {
  saveProject: (project: ProjectModel) => void;
  lastAddedConsultantId: string
}

const EditProject = (props: EditProjectProps) => {
  const [modalClientId, setModalClientId] = useState<string | undefined>(undefined)
  const [project, setProjectProperties] = useState<ProjectModel>({
    consultantId: props.lastAddedConsultantId,
    startDate: "",
    endDate: "",
    partner: "",
    partnerTariff: 0,
    client: "",
    clientTariff: 0
  });

  useEffect(() => {
    setProjectProperties({ ...project, consultantId: props.lastAddedConsultantId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.lastAddedConsultantId])

  const onSaveProject = (): void => {
    props.saveProject(project);
  };

  const isButtonDisabled = (): boolean => {
    const { consultantId } = project;

    if (!consultantId) {
      return true;
    }
    return false;
  };

  return (
    <Container className="edit-container">
      <Row className="page-title-container">
        <h1>{t("project.createNew")}</h1>
      </Row>
      <Form>
        <Row>
          <Col sm={5}>
            {modalClientId && <ConsultantModal show={!!modalClientId} onClose={() => setModalClientId(undefined)} />}

            <ConsultantSearchSelect
              label="Consultant"
              value={project.consultantId}
              onChange={(consultantId: string) => setProjectProperties({ ...project, consultantId })}
            />
          </Col>
          <Col sm={5} style={{ display: 'flex', alignItems: 'center' }}>
            <Button icon="fa fa-plus" size="sm" variant="secondary" onClick={() => setModalClientId('new')}>
              {t('project.newConsultant')}
            </Button>
          </Col>
        </Row>
        <Row>
          <ArrayInput
            config={projectFormConfig}
            model={project}
            onChange={(value: { [key: string]: any }) =>
              setProjectProperties({ ...project, ...value })
            }
            tPrefix="project."
          />
        </Row>
      </Form>
      <StickyFooter>
        <BusyButton
          onClick={() => onSaveProject()}
          disabled={isButtonDisabled()}
          data-tst="save"
        >
          {t("save")}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};

const mapStateToProps = (state: ConfacState) => ({ lastAddedConsultantId: state.app.lastAddedConsultantId });

export default connect(mapStateToProps, { saveProject })(EditProject);
