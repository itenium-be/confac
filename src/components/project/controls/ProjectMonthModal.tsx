import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import moment from 'moment';
import {t} from '../../utils';
import {saveProjectMonth} from '../../../actions';
import {BaseModalProps, Modal} from '../../controls/Modal';
import {ProjectMonthModel} from '../models/types';
import {DatePicker} from '../../controls/form-controls/DatePicker';

type ProjectMonthModalProps = BaseModalProps & {
  saveProjectMonth: (projectMonth: ProjectMonthModel) => void;
};

const _ProjectMonthModal = (props: ProjectMonthModalProps) => {
  const [projectMonth, setProjectMonth] = useState<ProjectMonthModel>({
    month: moment.utc().startOf('month'),
  });

  const {show, onClose} = props;

  return (
    <Modal show={show} onClose={onClose} title={t('project.newMonth')} onConfirm={() => props.saveProjectMonth(projectMonth)}>
      <Form>
        <Container>
          <Row>
            <DatePicker
              label={t('project.month')}
              dateFormat="MMMM - yyyy"
              value={projectMonth.month}
              onChange={date => setProjectMonth({month: date!.utc().startOf('month')})}
              showMonthYearPicker
            />
          </Row>
        </Container>
      </Form>
    </Modal>
  );
};

export const ProjectMonthModal = connect(null, {saveProjectMonth})(_ProjectMonthModal);
