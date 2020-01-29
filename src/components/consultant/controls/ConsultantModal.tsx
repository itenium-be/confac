import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../../utils';
import {saveConsultant} from '../../../actions';
import {ConfacState} from '../../../reducers/app-state';
import {getNewConsultant} from '../models/getNewConsultant';
import {ArrayInput} from '../../controls/form-controls/inputs/ArrayInput';
import {BaseModalProps, Modal} from '../../controls/Modal';
import {ConsultantModel} from '../models/ConsultantModel';
import {defaultConsultantModalProperties} from '../models/ConsultantConfig';


type ConsultantModalProps = BaseModalProps & {
  saveConsultant: (consultant: ConsultantModel) => void,
}


const _ConsultantModal = (props: ConsultantModalProps) => {
  const [consultant, setConsultantProperties] = useState<ConsultantModel>(getNewConsultant());

  return (
    <Modal
      show={props.show}
      onClose={props.onClose}
      title={t('consultant.createNew')}
      onConfirm={() => props.saveConsultant(consultant)}
    >
      <Form>
        <Container>
          <Row>
            <ArrayInput
              config={defaultConsultantModalProperties}
              model={consultant}
              onChange={value => setConsultantProperties({...consultant, ...value})}
              tPrefix="consultant.props."
            />
          </Row>
        </Container>
      </Form>
    </Modal>
  );
};

export const ConsultantModal = connect((state: ConfacState) => ({}), {saveConsultant})(_ConsultantModal);
