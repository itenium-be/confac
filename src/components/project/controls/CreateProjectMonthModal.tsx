import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../../utils';
import {saveProjectMonth} from '../../../actions';
import {BaseModalProps, Modal} from '../../controls/Modal';
import {ProjectMonthModel} from '../models/ProjectMonthModel';
import {DatePicker} from '../../controls/form-controls/DatePicker';
import {getNewProjectMonth} from '../models/getNewProject';

type ProjectMonthModalProps = BaseModalProps & {};


export const CreateProjectMonthModal = (props: ProjectMonthModalProps) => {
  const dispatch = useDispatch();
  const [projectMonth, setProjectMonth] = useState<ProjectMonthModel>(getNewProjectMonth());

  const {show, onClose} = props;

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={t('project.newMonth')}
      onConfirm={() => dispatch(saveProjectMonth(projectMonth))}
    >
      <Form>
        <Container>
          <Row>
            <DatePicker
              label={t('project.month')}
              dateFormat="MMMM - yyyy"
              value={projectMonth.month}
              onChange={date => date && setProjectMonth({...projectMonth, month: date.utc().startOf('month')})}
              showMonthYearPicker
            />
          </Row>
        </Container>
      </Form>
    </Modal>
  );
};
