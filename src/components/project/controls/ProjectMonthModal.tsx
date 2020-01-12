import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import moment, {Moment} from 'moment';
import {t} from '../../utils';
import {Modal, BaseModalProps, DatePicker} from '../../controls';
import {ProjectMonthModel} from '../models';
import {saveProjectMonth} from '../../../actions';

type ProjectMonthModalProps = BaseModalProps & {
  saveProjectMonth: (projectMonth: ProjectMonthModel) => void;
};

const _ProjectMonthModal = (props: ProjectMonthModalProps) => {
  const [projectMonth, setProjectMonth] = useState<ProjectMonthModel>({
    month: moment.utc().startOf('month'),
  });

  const {show, onClose, saveProjectMonth} = props;

  return (
    <Modal show={show} onClose={onClose} title={t('project.newMonth')} onConfirm={() => saveProjectMonth(projectMonth)}>
      <Form>
        <Container>
          <Row>
            <DatePicker
              label={t('project.month')}
              dateFormat="MMMM - yyyy"
              value={projectMonth.month}
              onChange={(date) => setProjectMonth({month: date!.utc().startOf('month')})}
              showMonthYearPicker
            />
          </Row>
        </Container>
      </Form>
    </Modal>
  );
};

export const ProjectMonthModal = connect(null, {saveProjectMonth})(_ProjectMonthModal);
