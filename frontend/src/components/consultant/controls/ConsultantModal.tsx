import {useState} from 'react';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../../utils';
import {getNewConsultant} from '../models/getNewConsultant';
import {ArrayInput} from '../../controls/form-controls/inputs/ArrayInput';
import {BaseModalProps, Modal} from '../../controls/Modal';
import {ConsultantModel} from '../models/ConsultantModel';
import {defaultConsultantModalProperties} from '../models/ConsultantConfig';


type ConsultantModalProps = BaseModalProps & {
  consultant?: ConsultantModel | null;
  onConfirm: (consultant: ConsultantModel) => void,
}


export const ConsultantModal = (props: ConsultantModalProps) => {
  const [consultant, setConsultantProperties] = useState<ConsultantModel>(props.consultant || getNewConsultant());

  return (
    <Modal
      show={props.show}
      onClose={props.onClose}
      title={consultant._id ? `${consultant.firstName} ${consultant.name}` : t('consultant.createNew')}
      onConfirm={() => props.onConfirm(consultant)}
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
