import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import {ConfacState} from '../../reducers/app-state';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {StickyFooter} from '../controls/other/StickyFooter';
import {getNewUser} from './models/getNewUser';
import {UserModel, Claim} from './models/UserModel';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {defaultUserProperties} from './models/UserConfig';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {saveUser} from '../../actions/userActions';
import {Audit} from '../admin/Audit';

interface EditUserProps {
  match: {
    params: {id: string};
  };
}


export const EditUser = (props: EditUserProps) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const model = useSelector((state: ConfacState) => state.user.users.find(c => c.alias === props.match.params.id));
  const [user, setUser] = useState<UserModel>(model || getNewUser());

  const docTitle = user._id ? 'userEdit' : 'userNew';
  useDocumentTitle(docTitle, {name: `${user.firstName} ${user.name}`});

  if (model && !user._id) {
    setUser(model);
  }

  const isButtonDisabled = (): boolean => {
    const {name, firstName} = user;

    if (!name || !firstName) {
      return true;
    }
    return false;
  };

  return (
    <Container className="edit-container">
      <Form>
        <Row className="page-title-container">
          <h1>{user._id ? `${user.firstName} ${user.name}` : t('user.createNew')}</h1>
          <Audit audit={user.audit} />
        </Row>
        <Row>
          <ArrayInput
            config={defaultUserProperties}
            model={user}
            onChange={(value: { [key: string]: any }) => setUser({...user, ...value})}
            tPrefix="user.props."
          />
        </Row>
      </Form>
      <StickyFooter claim={Claim.ManageUsers}>
        <BusyButton
          onClick={() => dispatch(saveUser(user, undefined, history))}
          disabled={isButtonDisabled()}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
