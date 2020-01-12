import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {ConfacState} from '../../reducers/app-state';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {saveConsultant} from '../../actions';
import {StickyFooter} from '../controls/skeleton/StickyFooter';
import {initNewConsultant} from './utils/initNewConsultant';
import {ConsultantModel} from './models/ConsultantModel';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {defaultConsultantProperties} from './models/ConsultantConfig';

interface EditConsultantProps {
  saveConsultant: (consultant: ConsultantModel) => void;
}

const EditConsultant = (props: EditConsultantProps) => {
  const [consultant, setConsultant] = useState<ConsultantModel>(initNewConsultant());

  const onSaveConsultant = (): void => {
    props.saveConsultant(consultant);
  };

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
          <h1>{t('consultant.createNew')}</h1>
        </Row>
        <Row>
          <ArrayInput
            config={defaultConsultantProperties}
            model={consultant}
            onChange={(value: { [key: string]: any }) => setConsultant({...consultant, ...value})}
            tPrefix="consultant."
          />
        </Row>
      </Form>
      <StickyFooter>
        <BusyButton
          onClick={onSaveConsultant}
          disabled={isButtonDisabled()}
          data-tst="save"
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};

const mapStateToProps = (state: ConfacState) => ({});

export default connect(mapStateToProps, {saveConsultant})(EditConsultant);
