import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router';
import {ConfacState} from '../../reducers/app-state';
import {t} from '../utils';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {StickyFooter} from '../controls/other/StickyFooter';
import {getNewRole} from './models/getNewUser';
import {RoleModel, Claim} from './models/UserModel';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {defaultRoleProperties} from './models/UserConfig';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {saveRole} from '../../actions/userActions';
import {Audit} from '../admin/audit/Audit';
import useEntityChangedToast from '../hooks/useEntityChangedToast';


export const EditRole = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const model = useSelector((state: ConfacState) => state.user.roles.find(c => c.name === params.id));
  const [role, setRole] = useState<RoleModel>(model || getNewRole());

  useEntityChangedToast(role._id);

  const docTitle = role._id ? 'roleEdit' : 'roleNew';
  useDocumentTitle(docTitle, {name: role.name});

  if (model && !role._id) {
    setRole(model);
  }

  return (
    <Container className="edit-container">
      <Form>
        <Row className="page-title-container">
          <h1>{role._id ? role.name : t('role.createNew')}</h1>
          <Audit model={model} modelType="role" />
        </Row>
        <Row>
          <ArrayInput
            config={defaultRoleProperties}
            model={role}
            onChange={(value: { [key: string]: any }) => setRole({...role, ...value})}
            tPrefix="role.props."
          />
        </Row>
      </Form>
      <StickyFooter claim={Claim.ManageUsers}>
        <BusyButton className="tst-save-role" onClick={() => dispatch(saveRole(role, undefined, navigate) as any)}>
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};
