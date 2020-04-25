import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {ConfacState} from '../../reducers/app-state';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {saveConsultant} from '../../actions';
import {StickyFooter} from '../controls/skeleton/StickyFooter';
import {getNewConsultant} from './models/getNewConsultant';
import {ConsultantModel} from './models/ConsultantModel';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {defaultConsultantProperties} from './models/ConsultantConfig';
import {useDocumentTitle} from '../hooks/useDocumentTitle';

interface EditConsultantProps {
  match: {
    params: {id: string};
  };
}


export const EditConsultant = (props: EditConsultantProps) => {
  const dispatch = useDispatch();
  const model = useSelector((state: ConfacState) => state.consultants.find(c => c.slug === props.match.params.id));
  const [consultant, setConsultant] = useState<ConsultantModel>(model || getNewConsultant());
  useDocumentTitle('consultantEdit', {name: `${consultant.firstName} ${consultant.name}`});

  if (model && !consultant._id) {
    setConsultant(model);
  }

  const isButtonDisabled = (): boolean => {
    const {name, firstName} = consultant;

    if (!name || !firstName) {
      return true;
    }
    return false;
  };

  return (
    <Container className="edit-container">
      <Form>
        <Row className="page-title-container">
          <h1>{consultant._id ? `${consultant.firstName} ${consultant.name}` : t('consultant.createNew')}</h1>
        </Row>
        <Row>
          <ArrayInput
            config={defaultConsultantProperties}
            model={consultant}
            onChange={(value: { [key: string]: any }) => setConsultant({...consultant, ...value})}
            tPrefix="consultant.props."
          />
        </Row>
      </Form>
      <StickyFooter>
        <BusyButton
          onClick={() => dispatch(saveConsultant(consultant))}
          disabled={isButtonDisabled()}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
