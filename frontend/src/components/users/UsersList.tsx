import {useSelector} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import {ListPage} from '../controls/table/ListPage';
import {userFeature, UserFeatureBuilderConfig} from './models/getUserFeature';
import {saveUser, saveRole} from '../../actions/userActions';
import {updateAppFilters} from '../../actions';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {roleFeature, RoleFeatureBuilderConfig} from './models/getRoleFeature';
import {Claim} from './models/UserModel';
import {ClaimGuard} from '../enhancers/EnhanceWithClaim';
import {Features} from '../controls/feature/feature-models';
import {useAppDispatch} from '../hooks/useAppDispatch';


export const UsersList = () => {
  useDocumentTitle('usersList');

  const dispatch = useAppDispatch();
  const users = useSelector((state: ConfacState) => ({filters: state.app.filters.users, data: state.user.users}));
  const roles = useSelector((state: ConfacState) => ({filters: state.app.filters.roles, data: state.user.roles}));

  const userConfig: UserFeatureBuilderConfig = {
    data: users.data,
    save: m => dispatch(saveUser(m)),
    filters: users.filters,
    setFilters: f => dispatch(updateAppFilters(Features.users, f)),
  };

  const roleConfig: RoleFeatureBuilderConfig = {
    data: roles.data,
    save: m => dispatch(saveRole(m)),
    filters: roles.filters,
    setFilters: f => dispatch(updateAppFilters(Features.roles, f)),
  };

  return (
    <>
      <ClaimGuard claim={Claim.ViewUsers}>
        <ListPage feature={userFeature(userConfig)} />
      </ClaimGuard>

      <ClaimGuard claim={Claim.ViewUsers}>
        <ListPage feature={roleFeature(roleConfig)} />
      </ClaimGuard>
    </>
  );
};
