import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../../utils';
import {createProjectsMonth} from '../../../actions';
import {BaseModalProps, Modal, ModalState} from '../../controls/Modal';
import {DatePicker} from '../../controls/form-controls/DatePicker';
import {Button} from '../../controls/form-controls/Button';

type ProjectMonthModalProps = BaseModalProps & {};


/** Create projectMonths by selecting a project month */
export const CreateProjectsMonthModal = (props: ProjectMonthModalProps) => {
  const dispatch = useDispatch();
  const [date, setDate] = useState<moment.Moment>(moment());

  const {show, onClose} = props;

  const month = date.utc().startOf('month');

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={t('projectMonth.createProjectsTitle')}
      onConfirm={() => dispatch(createProjectsMonth(month))}
    >
      <Form>
        <Container>
          <Row>
            <DatePicker
              label={t('projectMonth.createProjects')}
              dateFormat="MMMM - yyyy"
              value={date}
              onChange={value => value && setDate(value)}
              showMonthYearPicker
            />
          </Row>
        </Container>
      </Form>
    </Modal>
  );
};



export const CreateProjectsMonthModalButton = () => {
  const [modalProjectMonthId, setModalProjectMonthId] = useState<ModalState>(null);
  return (
    <>
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
    </>
  );
};
